#!/usr/bin/env python3
"""
================================================================
ISRO SOLAR FLARE PRESENTATION GENERATOR
================================================================
Generates a 20-slide government-grade PowerPoint presentation:
"Sovereign Space Weather Resilience: Automated Nowcasting and
 Forecasting of Solar Flares Utilizing Aditya-L1 X-Ray Payloads"

ISRO Color Palette:
  - Primary Orange:  #F47216
  - Marine Blue:     #0E88D3
  - Deep Navy:       #0A1628
  - Dark Slate:      #111D33
  - White:           #FFFFFF
  - Accent Teal:     #00C9A7
  - Accent Red:      #FF4444
================================================================
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn
from pptx.oxml import parse_xml
import copy

# ────────────────────────────────────────────────────────────────
# COLOR PALETTE
# ────────────────────────────────────────────────────────────────
ISRO_ORANGE   = RGBColor(0xF4, 0x72, 0x16)
ISRO_BLUE     = RGBColor(0x0E, 0x88, 0xD3)
DEEP_NAVY     = RGBColor(0x0A, 0x16, 0x28)
DARK_SLATE    = RGBColor(0x11, 0x1D, 0x33)
CARD_BG       = RGBColor(0x14, 0x22, 0x3B)
WHITE         = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_GRAY    = RGBColor(0xCC, 0xCC, 0xCC)
MED_GRAY      = RGBColor(0x99, 0x99, 0x99)
ACCENT_TEAL   = RGBColor(0x00, 0xC9, 0xA7)
ACCENT_RED    = RGBColor(0xFF, 0x44, 0x44)
ACCENT_GOLD   = RGBColor(0xFF, 0xD7, 0x00)
ACCENT_PURPLE = RGBColor(0x8B, 0x5C, 0xF6)
TABLE_HEAD_BG = RGBColor(0xF4, 0x72, 0x16)
TABLE_ROW_EVEN = RGBColor(0x10, 0x1C, 0x30)
TABLE_ROW_ODD  = RGBColor(0x14, 0x24, 0x3E)
SUBTITLE_GOLD = RGBColor(0xFF, 0xC1, 0x07)

# Presentation dimensions: Widescreen 16:9
SLIDE_WIDTH  = Inches(13.333)
SLIDE_HEIGHT = Inches(7.5)

# Image paths
IMG_DIR = os.path.join(
    os.path.expanduser("~"),
    ".gemini", "antigravity-ide", "brain",
    "db95dc43-9572-474a-a6fe-c1b5cc4ab9bf"
)

def find_image(prefix):
    """Find image file by prefix in artifacts directory."""
    for f in os.listdir(IMG_DIR):
        if f.startswith(prefix) and f.endswith('.png'):
            return os.path.join(IMG_DIR, f)
    return None

HERO_IMG      = find_image("aditya_l1_hero")
NEUPERT_IMG   = find_image("neupert_effect_diagram")
DASHBOARD_IMG = find_image("dashboard_mockup")
ML_ARCH_IMG   = find_image("ml_architecture")
SOLAR_IMG     = find_image("solar_flare_sun")


# ────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ────────────────────────────────────────────────────────────────

def set_slide_bg(slide, color):
    """Set solid background color for a slide."""
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_shape(slide, shape_type, left, top, width, height, fill_color=None,
              line_color=None, line_width=None):
    """Add a shape with optional fill and line."""
    shape = slide.shapes.add_shape(shape_type, left, top, width, height)
    shape.shadow.inherit = False
    if fill_color:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
    else:
        shape.fill.background()
    if line_color:
        shape.line.color.rgb = line_color
        shape.line.width = line_width or Pt(1)
    else:
        shape.line.fill.background()
    return shape


def add_textbox(slide, left, top, width, height, text="", font_size=14,
                font_color=WHITE, bold=False, alignment=PP_ALIGN.LEFT,
                font_name="Calibri", line_spacing=1.2):
    """Add a text box with styled text."""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = font_color
    p.font.bold = bold
    p.font.name = font_name
    p.alignment = alignment
    p.space_after = Pt(0)
    p.space_before = Pt(0)
    if line_spacing != 1.0:
        p.line_spacing = Pt(font_size * line_spacing)
    return txBox


def add_multiline_textbox(slide, left, top, width, height, lines,
                          font_name="Calibri", line_spacing=1.15):
    """Add textbox with multiple styled lines.
    lines = [(text, font_size, font_color, bold, alignment), ...]
    """
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, line_data in enumerate(lines):
        text, fsize, fcolor, fbold, falign = line_data
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.text = text
        p.font.size = Pt(fsize)
        p.font.color.rgb = fcolor
        p.font.bold = fbold
        p.font.name = font_name
        p.alignment = falign
        p.space_after = Pt(2)
        if line_spacing != 1.0:
            p.line_spacing = Pt(fsize * line_spacing)
    return txBox


def add_rounded_rect(slide, left, top, width, height, fill_color, corner_radius=Inches(0.15)):
    """Add a rounded rectangle card."""
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    shape.line.fill.background()
    shape.shadow.inherit = False
    return shape


def add_accent_bar(slide, left, top, width, height, color):
    """Add a thin accent bar / divider."""
    bar = add_shape(slide, MSO_SHAPE.RECTANGLE, left, top, width, height, fill_color=color)
    return bar


def add_gradient_overlay(slide, left, top, width, height, color1, color2):
    """Add a rectangle with gradient fill."""
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.line.fill.background()
    shape.shadow.inherit = False
    fill = shape.fill
    fill.gradient()
    fill.gradient_stops[0].color.rgb = color1
    fill.gradient_stops[0].position = 0.0
    fill.gradient_stops[1].color.rgb = color2
    fill.gradient_stops[1].position = 1.0
    return shape


def add_table(slide, left, top, width, height, rows, cols):
    """Add a table."""
    table_shape = slide.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table
    return table


def style_table_cell(cell, text, font_size=10, font_color=WHITE, bold=False,
                     bg_color=None, alignment=PP_ALIGN.LEFT, font_name="Calibri"):
    """Style a single table cell."""
    cell.text = ""
    p = cell.text_frame.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = font_color
    p.font.bold = bold
    p.font.name = font_name
    p.alignment = alignment
    cell.vertical_anchor = MSO_ANCHOR.MIDDLE
    if bg_color:
        cell.fill.solid()
        cell.fill.fore_color.rgb = bg_color


def add_slide_number(slide, number, total=20):
    """Add slide number in bottom right."""
    add_textbox(slide, Inches(11.8), Inches(7.0), Inches(1.3), Inches(0.4),
                f"{number} / {total}", font_size=9, font_color=MED_GRAY,
                alignment=PP_ALIGN.RIGHT)


def add_top_bar(slide):
    """Add top accent bar and ISRO branding strip."""
    add_shape(slide, MSO_SHAPE.RECTANGLE,
              Inches(0), Inches(0), SLIDE_WIDTH, Inches(0.06),
              fill_color=ISRO_ORANGE)


def add_section_header(slide, section_num, section_title, subtitle=""):
    """Add consistent section header at top of content slides."""
    add_top_bar(slide)
    # Section number badge
    badge = add_rounded_rect(slide, Inches(0.6), Inches(0.3), Inches(0.55), Inches(0.55),
                             ISRO_ORANGE)
    add_textbox(slide, Inches(0.6), Inches(0.33), Inches(0.55), Inches(0.55),
                f"{section_num:02d}", font_size=18, font_color=WHITE, bold=True,
                alignment=PP_ALIGN.CENTER)
    # Title
    add_textbox(slide, Inches(1.35), Inches(0.25), Inches(8), Inches(0.5),
                section_title, font_size=26, font_color=WHITE, bold=True,
                font_name="Calibri")
    if subtitle:
        add_textbox(slide, Inches(1.35), Inches(0.68), Inches(8), Inches(0.35),
                    subtitle, font_size=12, font_color=ISRO_ORANGE, bold=False)
    # Horizontal divider
    add_accent_bar(slide, Inches(0.6), Inches(1.05), Inches(12.1), Inches(0.02), ISRO_ORANGE)


# ────────────────────────────────────────────────────────────────
# SLIDE BUILDERS
# ────────────────────────────────────────────────────────────────

def build_slide_01_cover(prs):
    """Slide 1: Title / Cover Slide"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank
    set_slide_bg(slide, DEEP_NAVY)

    # Left dark panel
    add_gradient_overlay(slide, Inches(0), Inches(0), Inches(7.5), SLIDE_HEIGHT,
                         RGBColor(0x08, 0x12, 0x20), RGBColor(0x0D, 0x1A, 0x2E))

    # Orange accent strip on the left
    add_shape(slide, MSO_SHAPE.RECTANGLE,
              Inches(0), Inches(0), Inches(0.08), SLIDE_HEIGHT,
              fill_color=ISRO_ORANGE)

    # Top orange line
    add_shape(slide, MSO_SHAPE.RECTANGLE,
              Inches(0), Inches(0), SLIDE_WIDTH, Inches(0.05),
              fill_color=ISRO_ORANGE)

    # Bottom orange line
    add_shape(slide, MSO_SHAPE.RECTANGLE,
              Inches(0), Inches(7.42), SLIDE_WIDTH, Inches(0.08),
              fill_color=ISRO_ORANGE)

    # PROBLEM STATEMENT badge
    badge = add_rounded_rect(slide, Inches(0.6), Inches(0.6), Inches(2.8), Inches(0.45),
                             ISRO_ORANGE)
    add_textbox(slide, Inches(0.6), Inches(0.62), Inches(2.8), Inches(0.45),
                "PROBLEM STATEMENT 15", font_size=14, font_color=WHITE, bold=True,
                alignment=PP_ALIGN.CENTER)

    # Main Title
    add_multiline_textbox(
        slide, Inches(0.6), Inches(1.4), Inches(6.5), Inches(2.5),
        [
            ("Sovereign Space Weather", 36, WHITE, True, PP_ALIGN.LEFT),
            ("Resilience", 36, ISRO_ORANGE, True, PP_ALIGN.LEFT),
            ("", 10, WHITE, False, PP_ALIGN.LEFT),
            ("Automated Nowcasting & Forecasting of Solar Flares", 18, LIGHT_GRAY, False, PP_ALIGN.LEFT),
            ("Utilizing Aditya-L1 X-Ray Payloads", 18, LIGHT_GRAY, False, PP_ALIGN.LEFT),
        ],
        line_spacing=1.3
    )

    # Divider line
    add_accent_bar(slide, Inches(0.6), Inches(4.2), Inches(3.5), Inches(0.03), ISRO_ORANGE)

    # Mission badges
    badges_data = [
        ("🛰️  ISRO Aditya-L1 Mission", ISRO_BLUE),
        ("📡  SoLEXS + HEL1OS Payloads", ACCENT_TEAL),
        ("🧠  AI/ML Forecasting Pipeline", ACCENT_PURPLE),
    ]
    for i, (txt, color) in enumerate(badges_data):
        y = Inches(4.5) + Inches(i * 0.55)
        add_accent_bar(slide, Inches(0.6), y, Inches(0.05), Inches(0.35), color)
        add_textbox(slide, Inches(0.85), y, Inches(5), Inches(0.35),
                    txt, font_size=13, font_color=LIGHT_GRAY, bold=False)

    # KPI strip at bottom left
    kpi_data = [
        ("50+", "Satellites\nProtected"),
        ("8 min", "Warning\nWindow"),
        ("₹1000 Cr+", "Infrastructure\nat Risk"),
        ("5–15 min", "Prediction\nLead Time"),
    ]
    for i, (val, label) in enumerate(kpi_data):
        x = Inches(0.6) + Inches(i * 1.65)
        add_textbox(slide, x, Inches(6.15), Inches(1.5), Inches(0.45),
                    val, font_size=20, font_color=ISRO_ORANGE, bold=True,
                    alignment=PP_ALIGN.LEFT)
        add_textbox(slide, x, Inches(6.55), Inches(1.5), Inches(0.5),
                    label, font_size=9, font_color=MED_GRAY, bold=False,
                    alignment=PP_ALIGN.LEFT, line_spacing=1.1)

    # Right panel - hero image
    if HERO_IMG and os.path.exists(HERO_IMG):
        slide.shapes.add_picture(HERO_IMG, Inches(7.2), Inches(0.3),
                                  Inches(5.8), Inches(6.8))
    else:
        # Fallback: gradient panel
        add_gradient_overlay(slide, Inches(7.2), Inches(0.3), Inches(5.8), Inches(6.8),
                             RGBColor(0x0E, 0x50, 0x88), RGBColor(0xF4, 0x72, 0x16))

    # Footer
    add_textbox(slide, Inches(0.6), Inches(7.1), Inches(5), Inches(0.3),
                "Indian Space Research Organisation  |  Department of Space  |  Government of India",
                font_size=8, font_color=MED_GRAY, alignment=PP_ALIGN.LEFT)


def build_slide_02_agenda(prs):
    """Slide 2: Agenda / Table of Contents"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 0, "PRESENTATION AGENDA", "Comprehensive Technical Blueprint")

    agenda_items = [
        ("01", "Strategic Imperative", "Why sovereign space weather forecasting is critical"),
        ("02", "Mission & Instrumentation", "Aditya-L1, SoLEXS & HEL1OS specifications"),
        ("03", "Problem Definition", "Infrastructure risk quantification"),
        ("04", "Solar Flare Physics", "Thermal & non-thermal emission mechanisms"),
        ("05", "Flare Classification", "GOES A/B/C/M/X classification system"),
        ("06", "Dataset Acquisition", "PRADAN portal + supplementary data sources"),
        ("07", "Data Engineering Pipeline", "Parsing, synchronization & augmentation"),
        ("08", "Nowcasting Algorithm", "Real-time detection & master catalogue"),
        ("09", "HOPE Precursor Technique", "Hot Onset Precursor Event physics"),
        ("10", "Forecasting Model", "1D-CNN + BiLSTM + Transformer architecture"),
        ("11", "System Architecture", "End-to-end pipeline & dashboard"),
        ("12", "Evaluation Metrics", "TSS, HSS, POD, FAR benchmarks"),
        ("13", "Technology Stack", "Open-source tools & frameworks"),
        ("14", "Expected Outcomes", "Deliverables & strategic value"),
        ("15", "Implementation Roadmap", "15-week phased execution plan"),
        ("16", "Data Sources Registry", "All referenced datasets & URLs"),
        ("17", "Strategic Conclusions", "Summary & next steps"),
    ]

    col1_items = agenda_items[:9]
    col2_items = agenda_items[9:]

    for col_idx, items in enumerate([col1_items, col2_items]):
        base_x = Inches(0.6) + Inches(col_idx * 6.3)
        for i, (num, title, desc) in enumerate(items):
            y = Inches(1.3) + Inches(i * 0.65)
            # Number badge
            add_rounded_rect(slide, base_x, y, Inches(0.5), Inches(0.45), ISRO_ORANGE)
            add_textbox(slide, base_x, y + Inches(0.03), Inches(0.5), Inches(0.45),
                        num, font_size=13, font_color=WHITE, bold=True,
                        alignment=PP_ALIGN.CENTER)
            # Title
            add_textbox(slide, base_x + Inches(0.65), y, Inches(2.5), Inches(0.25),
                        title, font_size=13, font_color=WHITE, bold=True)
            # Description
            add_textbox(slide, base_x + Inches(0.65), y + Inches(0.22), Inches(4.5), Inches(0.25),
                        desc, font_size=9, font_color=MED_GRAY)

    add_slide_number(slide, 2)


def build_slide_03_strategic_imperative(prs):
    """Slide 3: The Strategic Imperative"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 1, "THE STRATEGIC IMPERATIVE",
                       "Why Sovereign Space Weather Forecasting is Critical for National Security")

    # Left column - threat cards
    threats = [
        ("🛰️", "Satellite Vulnerability", "50+ critical assets (NavIC, INSAT, GSAT)\nrequire real-time protection from\nradiation-induced anomalies", ISRO_ORANGE),
        ("⚡", "Power Grid Risk", "Geomagnetically Induced Currents (GIC)\ncan cause catastrophic transformer\ndamage in terrestrial power grids", ACCENT_RED),
        ("📡", "Communications Blackout", "X-class flares cause R4-R5 radio blackouts,\ncrippling HF communications critical\nfor aviation & defense operations", ISRO_BLUE),
        ("🌐", "Navigation Disruption", "Ionospheric delays of 9–20 meters during\nmajor events cripple GPS/NavIC\nprecision for civil & military use", ACCENT_TEAL),
    ]

    for i, (icon, title, desc, color) in enumerate(threats):
        y = Inches(1.35) + Inches(i * 1.45)
        card = add_rounded_rect(slide, Inches(0.6), y, Inches(5.8), Inches(1.3), CARD_BG)
        # Color accent bar on card
        add_accent_bar(slide, Inches(0.6), y, Inches(0.06), Inches(1.3), color)
        # Icon
        add_textbox(slide, Inches(0.85), y + Inches(0.15), Inches(0.5), Inches(0.5),
                    icon, font_size=24, alignment=PP_ALIGN.CENTER)
        # Title
        add_textbox(slide, Inches(1.5), y + Inches(0.12), Inches(4.5), Inches(0.35),
                    title, font_size=15, font_color=color, bold=True)
        # Description
        add_textbox(slide, Inches(1.5), y + Inches(0.45), Inches(4.5), Inches(0.8),
                    desc, font_size=10, font_color=LIGHT_GRAY, line_spacing=1.2)

    # Right column - key stats
    stats = [
        ("₹1,000+ Cr", "Estimated economic impact of\na single unmitigated X-class event"),
        ("~8 Minutes", "Time for solar radiation to\ntraverse Earth-Sun distance"),
        ("Solar Cycle 25", "Currently at solar maximum —\npeak flare activity period"),
    ]

    for i, (val, desc) in enumerate(stats):
        y = Inches(1.35) + Inches(i * 1.95)
        card = add_rounded_rect(slide, Inches(6.8), y, Inches(5.9), Inches(1.7), CARD_BG)
        add_textbox(slide, Inches(7.1), y + Inches(0.2), Inches(5.3), Inches(0.6),
                    val, font_size=32, font_color=ISRO_ORANGE, bold=True,
                    alignment=PP_ALIGN.CENTER)
        add_accent_bar(slide, Inches(8.5), y + Inches(0.75), Inches(2.5), Inches(0.02), ISRO_ORANGE)
        add_textbox(slide, Inches(7.1), y + Inches(0.9), Inches(5.3), Inches(0.7),
                    desc, font_size=12, font_color=LIGHT_GRAY,
                    alignment=PP_ALIGN.CENTER, line_spacing=1.3)

    # Bottom quote
    add_textbox(slide, Inches(0.6), Inches(6.9), Inches(12), Inches(0.4),
                '"Anticipating disruptions is critical for infrastructure safeguarding" — ISRO Problem Statement 15',
                font_size=10, font_color=SUBTITLE_GOLD, bold=True,
                alignment=PP_ALIGN.CENTER, font_name="Calibri")

    add_slide_number(slide, 3)


def build_slide_04_mission(prs):
    """Slide 4: Aditya-L1 Mission & Instrumentation"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 2, "ADITYA-L1 MISSION & INSTRUMENTATION",
                       "India's First Dedicated Solar Observatory at Lagrange Point L1")

    # Mission facts panel
    facts_card = add_rounded_rect(slide, Inches(0.6), Inches(1.35), Inches(5.8), Inches(5.6), CARD_BG)

    mission_facts = [
        ("Launch Date:", "September 2, 2023 (PSLV-C57)"),
        ("L1 Insertion:", "January 6, 2024"),
        ("Orbit:", "Halo orbit at Sun-Earth L1"),
        ("Distance:", "~1.5 million km from Earth"),
        ("Payloads:", "7 indigenous scientific instruments"),
        ("Vantage:", "Continuous, uninterrupted solar view"),
        ("Data Released:", "23+ TB into public domain"),
    ]

    add_textbox(slide, Inches(0.9), Inches(1.5), Inches(5), Inches(0.4),
                "Mission Parameters", font_size=18, font_color=ISRO_ORANGE, bold=True)
    add_accent_bar(slide, Inches(0.9), Inches(1.9), Inches(4.8), Inches(0.02), ISRO_ORANGE)

    for i, (label, value) in enumerate(mission_facts):
        y = Inches(2.1) + Inches(i * 0.55)
        add_textbox(slide, Inches(0.9), y, Inches(2.2), Inches(0.35),
                    label, font_size=11, font_color=ISRO_BLUE, bold=True)
        add_textbox(slide, Inches(3.0), y, Inches(3.2), Inches(0.35),
                    value, font_size=11, font_color=WHITE)

    # Advantage box
    adv_card = add_rounded_rect(slide, Inches(0.9), Inches(6.0), Inches(5.2), Inches(0.7),
                                 RGBColor(0x0E, 0x35, 0x58))
    add_textbox(slide, Inches(1.1), Inches(6.05), Inches(4.8), Inches(0.6),
                "✅ Eliminates atmospheric absorption & geomagnetic shielding\n"
                "✅ 24/7 uninterrupted solar surveillance from L1",
                font_size=10, font_color=ACCENT_TEAL, bold=False, line_spacing=1.4)

    # Right side: SoLEXS vs HEL1OS comparison
    # SoLEXS card
    solexs_card = add_rounded_rect(slide, Inches(6.8), Inches(1.35), Inches(2.85), Inches(5.6), CARD_BG)
    add_accent_bar(slide, Inches(6.8), Inches(1.35), Inches(2.85), Inches(0.06), ISRO_ORANGE)
    add_textbox(slide, Inches(6.9), Inches(1.55), Inches(2.65), Inches(0.4),
                "SoLEXS", font_size=18, font_color=ISRO_ORANGE, bold=True,
                alignment=PP_ALIGN.CENTER)
    add_textbox(slide, Inches(6.9), Inches(1.9), Inches(2.65), Inches(0.3),
                "Soft X-ray Spectrometer", font_size=10, font_color=MED_GRAY,
                alignment=PP_ALIGN.CENTER)

    solexs_specs = [
        "Energy: 2–22 keV",
        "Detector: Si Drift (SDD)",
        "Area: 7.1 mm² + 0.1 mm²",
        "Resolution: ~170 eV @ 5.9 keV",
        "Cadence: 1-second spectra",
        "Target: Thermal coronal",
        "          plasma heating",
        "Developed: URSC Bengaluru",
    ]
    for i, spec in enumerate(solexs_specs):
        y = Inches(2.35) + Inches(i * 0.42)
        add_textbox(slide, Inches(7.0), y, Inches(2.5), Inches(0.3),
                    spec, font_size=9, font_color=LIGHT_GRAY)

    # HEL1OS card
    helios_card = add_rounded_rect(slide, Inches(9.9), Inches(1.35), Inches(2.85), Inches(5.6), CARD_BG)
    add_accent_bar(slide, Inches(9.9), Inches(1.35), Inches(2.85), Inches(0.06), ISRO_BLUE)
    add_textbox(slide, Inches(10.0), Inches(1.55), Inches(2.65), Inches(0.4),
                "HEL1OS", font_size=18, font_color=ISRO_BLUE, bold=True,
                alignment=PP_ALIGN.CENTER)
    add_textbox(slide, Inches(10.0), Inches(1.9), Inches(2.65), Inches(0.3),
                "Hard X-ray Spectrometer", font_size=10, font_color=MED_GRAY,
                alignment=PP_ALIGN.CENTER)

    helios_specs = [
        "Energy: 10–150 keV",
        "Detector: CdTe + CZT",
        "Area: 0.5 cm² + 32 cm²",
        "Resolution: ~1 keV @ 14 keV",
        "Cadence: Event-mode (μs)",
        "Target: Non-thermal",
        "          bremsstrahlung",
        "Developed: SAG/URSC",
    ]
    for i, spec in enumerate(helios_specs):
        y = Inches(2.35) + Inches(i * 0.42)
        add_textbox(slide, Inches(10.1), y, Inches(2.5), Inches(0.3),
                    spec, font_size=9, font_color=LIGHT_GRAY)

    # "VS" badge between the two cards
    vs_badge = add_rounded_rect(slide, Inches(9.35), Inches(3.5), Inches(0.6), Inches(0.6),
                                 DEEP_NAVY)
    add_textbox(slide, Inches(9.35), Inches(3.55), Inches(0.6), Inches(0.5),
                "VS", font_size=14, font_color=ISRO_ORANGE, bold=True,
                alignment=PP_ALIGN.CENTER)

    add_slide_number(slide, 4)


def build_slide_05_flare_physics(prs):
    """Slide 5: Solar Flare Physics & X-Ray Emissions"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 4, "SOLAR FLARE PHYSICS",
                       "Thermal & Non-Thermal X-Ray Emission Mechanisms")

    # Left: Solar flare image
    if SOLAR_IMG and os.path.exists(SOLAR_IMG):
        slide.shapes.add_picture(SOLAR_IMG, Inches(0.6), Inches(1.35),
                                  Inches(5.0), Inches(3.5))
    else:
        img_placeholder = add_rounded_rect(slide, Inches(0.6), Inches(1.35),
                                            Inches(5.0), Inches(3.5), CARD_BG)

    # Physics explanation cards
    # Thermal regime card
    thermal_card = add_rounded_rect(slide, Inches(5.9), Inches(1.35), Inches(6.6), Inches(1.55), CARD_BG)
    add_accent_bar(slide, Inches(5.9), Inches(1.35), Inches(0.06), Inches(1.55), ISRO_ORANGE)
    add_textbox(slide, Inches(6.2), Inches(1.45), Inches(6.0), Inches(0.35),
                "Thermal Regime — Soft X-rays (1–22 keV)", font_size=14, font_color=ISRO_ORANGE, bold=True)
    add_textbox(slide, Inches(6.2), Inches(1.8), Inches(6.0), Inches(1.0),
                "• Emission from multi-million degree coronal plasma\n"
                "• Quiescent corona: 1–3 MK → Flare plasma: 10–35 MK\n"
                "• Primary metric for flare magnitude classification\n"
                "• Gradual rise and decay profile (thermal timescale)",
                font_size=10, font_color=LIGHT_GRAY, line_spacing=1.4)

    # Non-thermal regime card
    nonthermal_card = add_rounded_rect(slide, Inches(5.9), Inches(3.1), Inches(6.6), Inches(1.55), CARD_BG)
    add_accent_bar(slide, Inches(5.9), Inches(3.1), Inches(0.06), Inches(1.55), ISRO_BLUE)
    add_textbox(slide, Inches(6.2), Inches(3.2), Inches(6.0), Inches(0.35),
                "Non-Thermal Regime — Hard X-rays (10–150 keV)", font_size=14, font_color=ISRO_BLUE, bold=True)
    add_textbox(slide, Inches(6.2), Inches(3.55), Inches(6.0), Inches(1.0),
                "• Impulsive bremsstrahlung from accelerated electrons\n"
                "• Thick-target radiation at chromospheric footpoints\n"
                "• Direct indicator of explosive energy release\n"
                "• Exhibits Quasi-Periodic Pulsations (QPPs)",
                font_size=10, font_color=LIGHT_GRAY, line_spacing=1.4)

    # Neupert Effect section
    neupert_card = add_rounded_rect(slide, Inches(0.6), Inches(5.1), Inches(12.1), Inches(1.75), CARD_BG)
    add_accent_bar(slide, Inches(0.6), Inches(5.1), Inches(12.1), Inches(0.06), ACCENT_TEAL)
    add_textbox(slide, Inches(0.9), Inches(5.3), Inches(4), Inches(0.35),
                "⚡ The Neupert Effect — Key Physical Coupling", font_size=16, font_color=ACCENT_TEAL, bold=True)
    add_textbox(slide, Inches(0.9), Inches(5.7), Inches(5.5), Inches(1.0),
                "The rate of increase of Soft X-ray flux is directly\n"
                "proportional to the instantaneous Hard X-ray flux.\n\n"
                "F_SXR(t) ∝ ∫ F_HXR(t') dt'   →   dF_SXR/dt ∝ F_HXR(t)\n\n"
                "This serves as the PRIMARY cross-validation mechanism\n"
                "for the nowcasting pipeline.",
                font_size=10, font_color=LIGHT_GRAY, line_spacing=1.3)

    # Neupert diagram image
    if NEUPERT_IMG and os.path.exists(NEUPERT_IMG):
        slide.shapes.add_picture(NEUPERT_IMG, Inches(7.2), Inches(5.25),
                                  Inches(5.2), Inches(1.5))

    add_slide_number(slide, 5)


def build_slide_06_classification(prs):
    """Slide 6: Solar Flare Classification Table"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 5, "SOLAR FLARE CLASSIFICATION",
                       "GOES X-Ray Flux Standard (1–8 Å Band)")

    # Classification table
    table = add_table(slide, Inches(0.6), Inches(1.4), Inches(12.1), Inches(4.5), 6, 4)

    headers = ["Flare Class", "Peak Flux (W/m²)", "Physical Description", "Space Weather Impact"]
    data = [
        ["A", "< 10⁻⁷", "Micro-flares; baseline background level", "No terrestrial effect"],
        ["B", "10⁻⁷ – 10⁻⁶", "Very minor localized active region heating", "No significant effect"],
        ["C", "10⁻⁶ – 10⁻⁵", "Minor flare events with limited coronal heating", "Brief HF radio degradation (R1)"],
        ["M", "10⁻⁵ – 10⁻⁴", "Medium-large flares; often with CMEs", "R2-R3 blackouts; minor storms"],
        ["X", "≥ 10⁻⁴", "Extreme events; severe infrastructure risk", "R4-R5 blackouts; GIC damage"],
    ]

    # Style header row
    for j, h in enumerate(headers):
        style_table_cell(table.cell(0, j), h, font_size=12, font_color=WHITE,
                         bold=True, bg_color=ISRO_ORANGE, alignment=PP_ALIGN.CENTER)

    # Style data rows
    row_colors = [
        (MED_GRAY, TABLE_ROW_EVEN),    # A
        (LIGHT_GRAY, TABLE_ROW_ODD),   # B
        (SUBTITLE_GOLD, TABLE_ROW_EVEN),  # C
        (ISRO_ORANGE, TABLE_ROW_ODD),  # M
        (ACCENT_RED, TABLE_ROW_EVEN),  # X
    ]

    for i, row_data in enumerate(data):
        class_color, bg = row_colors[i]
        for j, cell_text in enumerate(row_data):
            fc = class_color if j == 0 else LIGHT_GRAY
            fb = (j == 0)
            fs = 14 if j == 0 else 10
            style_table_cell(table.cell(i + 1, j), cell_text,
                             font_size=fs, font_color=fc, bold=fb,
                             bg_color=bg, alignment=PP_ALIGN.CENTER if j < 2 else PP_ALIGN.LEFT)

    # Key insight box
    insight_card = add_rounded_rect(slide, Inches(0.6), Inches(6.1), Inches(12.1), Inches(0.9),
                                     RGBColor(0x0E, 0x35, 0x58))
    add_textbox(slide, Inches(0.9), Inches(6.2), Inches(11.5), Inches(0.7),
                "⚠️  KEY: Each class represents a 10× increase in peak flux. The pipeline must detect ALL classes "
                "(A through X) while maintaining high True Positive Rate for M and X-class events — the classes "
                "with severe infrastructure impact. Extreme class imbalance (X-class events are ~100× rarer) "
                "demands specialized loss functions.",
                font_size=10, font_color=SUBTITLE_GOLD, line_spacing=1.3)

    add_slide_number(slide, 6)


def build_slide_07_dataset(prs):
    """Slide 7: Dataset Acquisition & Sources"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 6, "DATASET ACQUISITION",
                       "Primary & Supplementary Data Sources for Model Training")

    # Primary data source
    primary_card = add_rounded_rect(slide, Inches(0.6), Inches(1.35), Inches(5.8), Inches(2.5), CARD_BG)
    add_accent_bar(slide, Inches(0.6), Inches(1.35), Inches(5.8), Inches(0.06), ISRO_ORANGE)
    add_textbox(slide, Inches(0.9), Inches(1.55), Inches(5.0), Inches(0.35),
                "🛰️  PRIMARY DATA — ISRO PRADAN Portal", font_size=15, font_color=ISRO_ORANGE, bold=True)
    add_textbox(slide, Inches(0.9), Inches(1.95), Inches(5.0), Inches(1.7),
                "Portal: pradan.issdc.gov.in/al1\n\n"
                "• SoLEXS Level-1 FITS — 1-sec cadence SXR spectra\n"
                "• HEL1OS Level-1 FITS — Event-mode HXR photon list\n"
                "• SolexsLOODS processing software included\n"
                "• 23+ TB released into public domain\n"
                "• Registration required; Chrome recommended",
                font_size=10, font_color=LIGHT_GRAY, line_spacing=1.35)

    # Supplementary sources grid
    supp_sources = [
        ("GOES/XRS", "ngdc.noaa.gov/stp/\nsatellite/goes/", "Ground-truth labels\n2-sec SXR since 1975", ISRO_BLUE),
        ("RHESSI", "hesperia.gsfc.\nnasa.gov/rhessi3/", "HXR flare catalogue\n3-300 keV imaging", ACCENT_TEAL),
        ("Fermi/GBM", "hesperia.gsfc.\nnasa.gov/fermi/", "Gamma-ray burst\nmonitor data", ACCENT_PURPLE),
        ("SDO/AIA", "sdo.gsfc.\nnasa.gov/data/", "EUV images &\nmagnetograms", ISRO_ORANGE),
        ("NOAA SWPC", "swpc.noaa.gov", "Real-time alerts\n& forecasts", ACCENT_RED),
        ("SunPy", "docs.sunpy.org", "Python API for\nall solar data", ACCENT_GOLD),
    ]

    add_textbox(slide, Inches(6.8), Inches(1.35), Inches(5.5), Inches(0.35),
                "SUPPLEMENTARY DATA SOURCES", font_size=14, font_color=ISRO_ORANGE, bold=True)
    add_accent_bar(slide, Inches(6.8), Inches(1.7), Inches(5.5), Inches(0.02), ISRO_ORANGE)

    for i, (name, url, desc, color) in enumerate(supp_sources):
        col = i % 3
        row = i // 3
        x = Inches(6.8) + Inches(col * 1.9)
        y = Inches(1.9) + Inches(row * 1.9)
        card = add_rounded_rect(slide, x, y, Inches(1.75), Inches(1.7), CARD_BG)
        add_accent_bar(slide, x, y, Inches(1.75), Inches(0.04), color)
        add_textbox(slide, x + Inches(0.1), y + Inches(0.15), Inches(1.55), Inches(0.3),
                    name, font_size=12, font_color=color, bold=True, alignment=PP_ALIGN.CENTER)
        add_textbox(slide, x + Inches(0.1), y + Inches(0.5), Inches(1.55), Inches(0.5),
                    url, font_size=7, font_color=MED_GRAY, alignment=PP_ALIGN.CENTER, line_spacing=1.2)
        add_textbox(slide, x + Inches(0.1), y + Inches(1.05), Inches(1.55), Inches(0.55),
                    desc, font_size=8, font_color=LIGHT_GRAY, alignment=PP_ALIGN.CENTER, line_spacing=1.3)

    # Data pipeline steps
    pipeline_card = add_rounded_rect(slide, Inches(0.6), Inches(4.1), Inches(5.8), Inches(2.7), CARD_BG)
    add_textbox(slide, Inches(0.9), Inches(4.2), Inches(5.0), Inches(0.35),
                "📊  5-STEP DATA PIPELINE", font_size=14, font_color=ACCENT_TEAL, bold=True)

    steps = [
        "1. Register & authenticate on PRADAN portal",
        "2. Download SoLEXS + HEL1OS Level-1 FITS files",
        "3. Parse with Astropy + SolexsLOODS toolkit",
        "4. Cross-match with GOES ground-truth labels (UTC)",
        "5. Augment with RHESSI/Fermi/SDO supplementary data",
    ]
    for i, step in enumerate(steps):
        y = Inches(4.6) + Inches(i * 0.4)
        add_textbox(slide, Inches(0.9), y, Inches(5.0), Inches(0.3),
                    step, font_size=10, font_color=LIGHT_GRAY)

    # Research papers box
    papers_card = add_rounded_rect(slide, Inches(6.8), Inches(5.6), Inches(5.8), Inches(1.2), CARD_BG)
    add_textbox(slide, Inches(7.0), Inches(5.7), Inches(5.4), Inches(0.3),
                "📄  KEY INSTRUMENT PAPERS (arXiv)", font_size=11, font_color=SUBTITLE_GOLD, bold=True)
    add_textbox(slide, Inches(7.0), Inches(6.0), Inches(5.4), Inches(0.7),
                "• SoLEXS calibration: arxiv.org/abs/2509.26292\n"
                "• HEL1OS spectrometer: arxiv.org/abs/2512.12679\n"
                "• HOPE nowcasting: arxiv.org/abs/2509.05234",
                font_size=9, font_color=LIGHT_GRAY, line_spacing=1.35)

    add_slide_number(slide, 7)


def build_slide_08_data_engineering(prs):
    """Slide 8: Data Engineering Pipeline"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 7, "DATA ENGINEERING PIPELINE",
                       "Level-1 FITS Parsing, Calibration & Temporal Synchronization")

    # Pipeline stages as horizontal flow
    stages = [
        ("RAW\nTELEMETRY", "FITS/CDF files\nfrom PRADAN", ISRO_ORANGE),
        ("BACKGROUND\nSUBTRACTION", "⁵⁵Fe calibration\nNi/Pb removal", ISRO_BLUE),
        ("DEADTIME\nCORRECTION", "Photon pileup\ncompensation", ACCENT_TEAL),
        ("TEMPORAL\nALIGNMENT", "1-sec grid\nresample HXR", ACCENT_PURPLE),
        ("GROUND TRUTH\nLABELING", "GOES class\nUTC matching", ACCENT_RED),
    ]

    for i, (title, desc, color) in enumerate(stages):
        x = Inches(0.4) + Inches(i * 2.55)
        y = Inches(1.4)
        # Stage card
        card = add_rounded_rect(slide, x, y, Inches(2.2), Inches(1.6), CARD_BG)
        add_accent_bar(slide, x, y, Inches(2.2), Inches(0.05), color)
        # Stage number
        add_textbox(slide, x + Inches(0.1), y + Inches(0.15), Inches(0.4), Inches(0.35),
                    str(i + 1), font_size=20, font_color=color, bold=True)
        add_textbox(slide, x + Inches(0.1), y + Inches(0.5), Inches(2.0), Inches(0.5),
                    title, font_size=11, font_color=WHITE, bold=True, line_spacing=1.2)
        add_textbox(slide, x + Inches(0.1), y + Inches(1.0), Inches(2.0), Inches(0.5),
                    desc, font_size=9, font_color=MED_GRAY, line_spacing=1.2)
        # Arrow between stages
        if i < len(stages) - 1:
            add_textbox(slide, x + Inches(2.15), y + Inches(0.55), Inches(0.5), Inches(0.5),
                        "→", font_size=24, font_color=ISRO_ORANGE, bold=True,
                        alignment=PP_ALIGN.CENTER)

    # Detailed explanations
    details = [
        ("HYPERMET Detector Response Model", ISRO_ORANGE,
         "SoLEXS response modeled as superposition of:\n"
         "• Main Gaussian Peak — true photon absorption\n"
         "• Si Escape Peak — 1.74 keV below main peak\n"
         "• Exponential Tail — incomplete charge collection\n"
         "• Shelf Component — flat low-energy continuum\n\n"
         "In-flight calibration via ⁵⁵Fe source + Ti foil\n"
         "producing Mn Kα (5.89 keV) & Kβ (6.49 keV) lines"),
        ("HEL1OS Fixed Filtration Advantage", ISRO_BLUE,
         "Unlike RHESSI/STIX which use movable attenuators:\n"
         "• HEL1OS uses FIXED stainless steel mesh collimator\n"
         "• No artificial discontinuities in light curves\n"
         "• Critical for ML pipeline — prevents false triggers\n"
         "• Enables robust QPP detection & detrending\n\n"
         "CdTe detectors cooled to -25°C for optimal\n"
         "spectral resolution in 10-40 keV transition band"),
        ("Temporal Synchronization Challenge", ACCENT_TEAL,
         "SoLEXS: Native 1-second spectral bins\n"
         "HEL1OS: Event-mode (microsecond timestamps)\n\n"
         "Solution: High-speed min/max/std pooling\n"
         "to resample HXR events → 1-sec grid\n\n"
         "Synchronized UTC axis is PREREQUISITE for\n"
         "sequential deep learning model ingestion"),
    ]

    for i, (title, color, desc) in enumerate(details):
        x = Inches(0.6) + Inches(i * 4.15)
        y = Inches(3.3)
        card = add_rounded_rect(slide, x, y, Inches(3.85), Inches(3.5), CARD_BG)
        add_accent_bar(slide, x, y, Inches(0.05), Inches(3.5), color)
        add_textbox(slide, x + Inches(0.2), y + Inches(0.15), Inches(3.5), Inches(0.35),
                    title, font_size=12, font_color=color, bold=True)
        add_accent_bar(slide, x + Inches(0.2), y + Inches(0.5), Inches(3.3), Inches(0.02), color)
        add_textbox(slide, x + Inches(0.2), y + Inches(0.6), Inches(3.5), Inches(2.7),
                    desc, font_size=9, font_color=LIGHT_GRAY, line_spacing=1.35)

    add_slide_number(slide, 8)


def build_slide_09_nowcasting(prs):
    """Slide 9: Nowcasting Algorithm"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 8, "ALGORITHMIC NOWCASTING",
                       "Real-Time Detection, Classification & Master Catalogue Generation")

    # Detection algorithm steps
    algo_steps = [
        ("1", "DYNAMIC\nBASELINE", "5-min rolling median filter\nCompute μ(t) and σ(t)\nRobust to cosmic ray spikes", ISRO_ORANGE),
        ("2", "SIGMA\nTRIGGER", "Onset: I(t) > μ(t) + 3σ(t)\nDebounce: 3 consecutive sec\nEliminate sensor noise", ISRO_BLUE),
        ("3", "RISE-RATE\nFILTER", "Compute dF/dt derivative\nReject gradual brightenings\nConfirm impulsive onset", ACCENT_TEAL),
        ("4", "NEUPERT\nVALIDATION", "Cross-correlate d(SXR)/dt\nwith HXR flux signal\nTrue Flare confirmation", ACCENT_PURPLE),
        ("5", "PEAK\nTRACKING", "Track to global maximum\nRecord t_peak timestamp\nMonitor decay phase", ACCENT_RED),
        ("6", "TERMINATION\nCRITERIA", "Flux < μ_onset + 1σ\nRecord total duration\nLog to catalogue", ACCENT_GOLD),
    ]

    for i, (num, title, desc, color) in enumerate(algo_steps):
        col = i % 3
        row = i // 3
        x = Inches(0.6) + Inches(col * 4.15)
        y = Inches(1.35) + Inches(row * 2.65)

        card = add_rounded_rect(slide, x, y, Inches(3.85), Inches(2.4), CARD_BG)
        add_accent_bar(slide, x, y, Inches(3.85), Inches(0.05), color)

        # Step number badge
        badge = add_rounded_rect(slide, x + Inches(0.15), y + Inches(0.2), Inches(0.5), Inches(0.5), color)
        add_textbox(slide, x + Inches(0.15), y + Inches(0.22), Inches(0.5), Inches(0.5),
                    num, font_size=20, font_color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)

        # Title
        add_textbox(slide, x + Inches(0.8), y + Inches(0.2), Inches(2.8), Inches(0.55),
                    title, font_size=13, font_color=color, bold=True, line_spacing=1.15)

        # Description
        add_textbox(slide, x + Inches(0.2), y + Inches(0.9), Inches(3.4), Inches(1.3),
                    desc, font_size=10, font_color=LIGHT_GRAY, line_spacing=1.4)

    # Master Catalogue output
    cat_card = add_rounded_rect(slide, Inches(0.6), Inches(6.55), Inches(12.1), Inches(0.75),
                                 RGBColor(0x0E, 0x35, 0x58))
    add_textbox(slide, Inches(0.9), Inches(6.6), Inches(11.5), Inches(0.65),
                "📋 UNIFIED MASTER CATALOGUE OUTPUT:  UTC Start/Peak/End  •  Duration  •  Peak SXR & HXR Flux  •  "
                "Spectral Indices  •  Equivalent GOES Class  •  Neupert Correlation Score  •  Stored in PostgreSQL + JSON/CSV export",
                font_size=10, font_color=ACCENT_TEAL, bold=False, line_spacing=1.3)

    add_slide_number(slide, 9)


def build_slide_10_hope(prs):
    """Slide 10: HOPE Precursor Technique"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 9, "HOPE PRECURSOR TECHNIQUE",
                       "Hot Onset Precursor Event — Physics-Based Pre-Flare Detection")

    # HOPE overview
    overview_card = add_rounded_rect(slide, Inches(0.6), Inches(1.35), Inches(6.0), Inches(2.0), CARD_BG)
    add_accent_bar(slide, Inches(0.6), Inches(1.35), Inches(0.06), Inches(2.0), ISRO_ORANGE)
    add_textbox(slide, Inches(0.9), Inches(1.45), Inches(5.5), Inches(0.4),
                "What is HOPE?", font_size=16, font_color=ISRO_ORANGE, bold=True)
    add_textbox(slide, Inches(0.9), Inches(1.85), Inches(5.5), Inches(1.3),
                "A physically-driven pre-flare signature identified in dual-channel\n"
                "soft X-ray data. Before the HXR impulsive phase begins and before\n"
                "the main SXR flux ramps up, a localized pocket of plasma in the\n"
                "active region undergoes intense, silent heating.\n\n"
                "Manifestation window: 5 – 15 minutes BEFORE flare peak",
                font_size=10, font_color=LIGHT_GRAY, line_spacing=1.35)

    # Three HOPE phenomena
    phenomena = [
        ("🌡️", "Temperature Surge", "Plasma T rapidly elevates\nfrom baseline to 10–15 MK\n\n'Horizontal branch' in\nT-EM diagram", ISRO_ORANGE),
        ("📈", "Emission Measure Spike", "Volumetric EM spikes by\n~1 order of magnitude\n\nIndicates density increase\nin coronal loops", ISRO_BLUE),
        ("🔬", "Abundance Shift", "Low-FIP element abundances\nshift to photospheric values\n\nIndicates early chromospheric\nmaterial injection", ACCENT_TEAL),
    ]

    for i, (icon, title, desc, color) in enumerate(phenomena):
        x = Inches(6.9) + Inches(i * 2.15)
        card = add_rounded_rect(slide, x, Inches(1.35), Inches(1.95), Inches(3.2), CARD_BG)
        add_accent_bar(slide, x, Inches(1.35), Inches(1.95), Inches(0.05), color)
        add_textbox(slide, x + Inches(0.1), Inches(1.55), Inches(1.75), Inches(0.4),
                    icon, font_size=28, alignment=PP_ALIGN.CENTER)
        add_textbox(slide, x + Inches(0.1), Inches(2.0), Inches(1.75), Inches(0.4),
                    title, font_size=11, font_color=color, bold=True, alignment=PP_ALIGN.CENTER)
        add_textbox(slide, x + Inches(0.1), Inches(2.45), Inches(1.75), Inches(1.8),
                    desc, font_size=9, font_color=LIGHT_GRAY, alignment=PP_ALIGN.CENTER, line_spacing=1.3)

    # Mathematical derivation
    math_card = add_rounded_rect(slide, Inches(0.6), Inches(3.6), Inches(6.0), Inches(3.2), CARD_BG)
    add_textbox(slide, Inches(0.9), Inches(3.7), Inches(5.5), Inches(0.35),
                "📐  Real-Time Plasma Parameter Derivation", font_size=14, font_color=ACCENT_TEAL, bold=True)
    add_accent_bar(slide, Inches(0.9), Inches(4.05), Inches(5.2), Inches(0.02), ACCENT_TEAL)
    add_textbox(slide, Inches(0.9), Inches(4.15), Inches(5.5), Inches(2.5),
                "Temperature Derivation (Filter Ratio Method):\n"
                "  R = F_short / F_long = f(T)  — independent of EM\n"
                "  Numerical interpolation against CHIANTI lookup tables\n"
                "  Continuous high-speed computation from SoLEXS bands\n\n"
                "Emission Measure Calculation:\n"
                "  EM = F_long / G_long(T)\n"
                "  Where G_long is temperature-dependent response function\n\n"
                "HOPE Trigger Condition:\n"
                "  dT/dt > threshold  AND  ΔEM > 1 order of magnitude\n"
                "  → Generate Flare Anticipation Index (FAI) alert",
                font_size=10, font_color=LIGHT_GRAY, line_spacing=1.35)

    # Lead time stats
    lead_card = add_rounded_rect(slide, Inches(6.9), Inches(4.8), Inches(5.7), Inches(1.9),
                                  RGBColor(0x0E, 0x35, 0x58))
    add_textbox(slide, Inches(7.1), Inches(4.9), Inches(5.3), Inches(0.4),
                "⏱️  DEMONSTRATED LEAD TIMES", font_size=14, font_color=SUBTITLE_GOLD, bold=True)
    add_textbox(slide, Inches(7.1), Inches(5.35), Inches(5.3), Inches(1.2),
                "• 5–15 minutes before flare peak (20 diverse flares)\n"
                "• Validated across C, M, and X-class events\n"
                "• Based on arxiv.org/abs/2509.05234\n"
                "• SoLEXS dual-band ratio enables real-time T extraction\n"
                "• Automated HOPE → FAI trigger feeds ML forecaster",
                font_size=10, font_color=LIGHT_GRAY, line_spacing=1.35)

    add_slide_number(slide, 10)


def build_slide_11_forecasting_model(prs):
    """Slide 11: ML Forecasting Architecture"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 10, "FORECASTING MODEL ARCHITECTURE",
                       "Hybrid 1D-CNN + BiLSTM + Transformer Deep Learning Pipeline")

    # Architecture diagram
    if ML_ARCH_IMG and os.path.exists(ML_ARCH_IMG):
        slide.shapes.add_picture(ML_ARCH_IMG, Inches(0.6), Inches(1.35),
                                  Inches(12.1), Inches(2.8))
    else:
        arch_placeholder = add_rounded_rect(slide, Inches(0.6), Inches(1.35),
                                             Inches(12.1), Inches(2.8), CARD_BG)

    # Component descriptions
    components = [
        ("INPUT TENSOR", "30–60 min trailing window\n1-sec cadence features:\n• SoLEXS flux + HEL1OS counts\n• dF/dt derivatives\n• T(MK) & EM values\n• SXR/HXR ratio\n• Spectral indices", ISRO_ORANGE),
        ("1D-CNN ENCODER", "Convolutional feature extractor\n• Slides across time window\n• Detects micro-variations\n• Identifies sharp spikes\n• Captures inflection points\n• Localized pattern matching\n• QPP detection", ISRO_BLUE),
        ("BiLSTM LAYER", "Bidirectional temporal encoder\n• Forward + backward pass\n• Maps sequential dependencies\n• Learns flare morphologies\n• Differentiates steep rise vs\n  gradual brightening\n• Maintains long memory", ACCENT_TEAL),
        ("TRANSFORMER", "Multi-head self-attention\n• Resolves vanishing gradients\n• Attends to specific moments\n• Correlates HOPE spike (t-14m)\n  with current HXR rise\n• Attention maps → interpretable\n• Time-to-peak estimation", ACCENT_PURPLE),
    ]

    for i, (title, desc, color) in enumerate(components):
        x = Inches(0.6) + Inches(i * 3.15)
        y = Inches(4.35)
        card = add_rounded_rect(slide, x, y, Inches(2.9), Inches(2.95), CARD_BG)
        add_accent_bar(slide, x, y, Inches(2.9), Inches(0.05), color)
        add_textbox(slide, x + Inches(0.15), y + Inches(0.15), Inches(2.6), Inches(0.35),
                    title, font_size=12, font_color=color, bold=True, alignment=PP_ALIGN.CENTER)
        add_accent_bar(slide, x + Inches(0.2), y + Inches(0.48), Inches(2.5), Inches(0.02), color)
        add_textbox(slide, x + Inches(0.15), y + Inches(0.6), Inches(2.6), Inches(2.2),
                    desc, font_size=9, font_color=LIGHT_GRAY, line_spacing=1.3)

    add_slide_number(slide, 11)


def build_slide_12_class_imbalance(prs):
    """Slide 12: Handling Class Imbalance & Outputs"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 10, "HANDLING CLASS IMBALANCE & MODEL OUTPUTS",
                       "Focal Loss, SMOTE Augmentation & Dual-Output Architecture")

    # Problem statement card
    problem_card = add_rounded_rect(slide, Inches(0.6), Inches(1.35), Inches(5.8), Inches(2.2), CARD_BG)
    add_accent_bar(slide, Inches(0.6), Inches(1.35), Inches(0.06), Inches(2.2), ACCENT_RED)
    add_textbox(slide, Inches(0.9), Inches(1.45), Inches(5.3), Inches(0.35),
                "⚠️  The Class Imbalance Problem", font_size=15, font_color=ACCENT_RED, bold=True)
    add_textbox(slide, Inches(0.9), Inches(1.85), Inches(5.3), Inches(1.5),
                "Solar activity follows a power-law distribution:\n\n"
                "• A/B/C-class flares: Ubiquitous — occur daily\n"
                "• M-class flares: Moderate — weekly during solar max\n"
                "• X-class flares: Extremely rare — ~100× less frequent\n\n"
                "Standard Cross-Entropy loss → model predicts 'No severe flare'\n"
                "Result: Statistically accurate but OPERATIONALLY USELESS",
                font_size=10, font_color=LIGHT_GRAY, line_spacing=1.3)

    # Focal Loss solution
    focal_card = add_rounded_rect(slide, Inches(0.6), Inches(3.8), Inches(5.8), Inches(2.8), CARD_BG)
    add_accent_bar(slide, Inches(0.6), Inches(3.8), Inches(0.06), Inches(2.8), ISRO_ORANGE)
    add_textbox(slide, Inches(0.9), Inches(3.9), Inches(5.3), Inches(0.35),
                "🎯  Solution: Focal Loss + SMOTE", font_size=15, font_color=ISRO_ORANGE, bold=True)
    add_textbox(slide, Inches(0.9), Inches(4.3), Inches(5.3), Inches(2.1),
                "Focal Loss adds modulating factor (1-p_t)^γ:\n\n"
                "FL(p_t) = -α_t (1 - p_t)^γ  log(p_t)\n\n"
                "• Heavily penalizes missed X/M-class flares (FN)\n"
                "• Down-weights easy background classifications\n"
                "• γ parameter tuned via Optuna hyperparameter search\n\n"
                "SMOTE (Synthetic Minority Over-sampling):\n"
                "• Time-series adapted synthetic augmentation\n"
                "• Balances severity distributions in training batches\n"
                "• Via imbalanced-learn library",
                font_size=10, font_color=LIGHT_GRAY, line_spacing=1.3)

    # Model outputs
    add_textbox(slide, Inches(6.8), Inches(1.35), Inches(5.7), Inches(0.35),
                "MODEL DUAL OUTPUTS", font_size=15, font_color=ISRO_BLUE, bold=True)
    add_accent_bar(slide, Inches(6.8), Inches(1.7), Inches(5.7), Inches(0.02), ISRO_BLUE)

    # Output 1
    out1_card = add_rounded_rect(slide, Inches(6.8), Inches(1.9), Inches(5.7), Inches(2.1), CARD_BG)
    add_accent_bar(slide, Inches(6.8), Inches(1.9), Inches(5.7), Inches(0.05), ISRO_BLUE)
    add_textbox(slide, Inches(7.1), Inches(2.1), Inches(5.1), Inches(0.35),
                "📊  Probability Vector (Classification)", font_size=13, font_color=ISRO_BLUE, bold=True)
    add_textbox(slide, Inches(7.1), Inches(2.5), Inches(5.1), Inches(1.3),
                "P(flare | next N minutes)\n\n"
                "• Multi-horizon: N = 5, 15, 30 minutes\n"
                "• Per-class probabilities: C, M, X\n"
                "• Softmax output layer\n"
                "• Threshold-tunable for operational sensitivity",
                font_size=10, font_color=LIGHT_GRAY, line_spacing=1.3)

    # Output 2
    out2_card = add_rounded_rect(slide, Inches(6.8), Inches(4.2), Inches(5.7), Inches(2.1), CARD_BG)
    add_accent_bar(slide, Inches(6.8), Inches(4.2), Inches(5.7), Inches(0.05), ACCENT_TEAL)
    add_textbox(slide, Inches(7.1), Inches(4.4), Inches(5.1), Inches(0.35),
                "⏱️  Lead Time Regression (Continuous)", font_size=13, font_color=ACCENT_TEAL, bold=True)
    add_textbox(slide, Inches(7.1), Inches(4.8), Inches(5.1), Inches(1.3),
                "t_remaining = time to peak intensity\n\n"
                "• Continuous regression output (minutes)\n"
                "• Quantifies warning buffer for operators\n"
                "• Linear output layer with MAE loss\n"
                "• Target: ≥ 5 minutes average lead time",
                font_size=10, font_color=LIGHT_GRAY, line_spacing=1.3)

    add_slide_number(slide, 12)


def build_slide_13_system_architecture(prs):
    """Slide 13: System Architecture & Dashboard"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 11, "SYSTEM ARCHITECTURE & DASHBOARD",
                       "End-to-End Operational Pipeline with Real-Time Visualization")

    # Dashboard mockup image
    if DASHBOARD_IMG and os.path.exists(DASHBOARD_IMG):
        slide.shapes.add_picture(DASHBOARD_IMG, Inches(6.6), Inches(1.35),
                                  Inches(6.1), Inches(3.5))

    # Architecture layers
    layers = [
        ("LAYER 1", "DATA INGESTION", "PRADAN API polling → FITS parsing → Background subtraction",
         ISRO_ORANGE),
        ("LAYER 2", "SIGNAL PROCESSING", "Temporal alignment → Dynamic baseline → Derivative computation",
         ISRO_BLUE),
        ("LAYER 3", "NOWCASTING ENGINE", "Sigma trigger → Neupert validation → Master catalogue update",
         ACCENT_TEAL),
        ("LAYER 4", "FORECASTING ENGINE", "HOPE extraction → Feature tensor → CNN+BiLSTM+Transformer inference",
         ACCENT_PURPLE),
        ("LAYER 5", "ALERT & VISUALIZATION", "Dashboard rendering → Alert generation → Operator notification",
         ACCENT_RED),
    ]

    for i, (layer, title, desc, color) in enumerate(layers):
        y = Inches(1.35) + Inches(i * 0.95)
        card = add_rounded_rect(slide, Inches(0.6), y, Inches(5.7), Inches(0.8), CARD_BG)
        add_accent_bar(slide, Inches(0.6), y, Inches(0.05), Inches(0.8), color)
        add_textbox(slide, Inches(0.8), y + Inches(0.05), Inches(1.0), Inches(0.3),
                    layer, font_size=8, font_color=color, bold=True)
        add_textbox(slide, Inches(0.8), y + Inches(0.25), Inches(2.2), Inches(0.3),
                    title, font_size=12, font_color=WHITE, bold=True)
        add_textbox(slide, Inches(0.8), y + Inches(0.48), Inches(5.2), Inches(0.3),
                    desc, font_size=9, font_color=MED_GRAY)

    # Dashboard tiers description
    tiers_card = add_rounded_rect(slide, Inches(6.6), Inches(5.05), Inches(6.1), Inches(1.8), CARD_BG)
    add_textbox(slide, Inches(6.8), Inches(5.1), Inches(5.7), Inches(0.3),
                "DASHBOARD — 3 OPERATIONAL TIERS", font_size=13, font_color=ISRO_ORANGE, bold=True)
    add_accent_bar(slide, Inches(6.8), Inches(5.4), Inches(5.5), Inches(0.02), ISRO_ORANGE)

    tiers = [
        ("1. Live Telemetry", "Dual-panel log-scaled SXR+HXR light curves, 30-min rolling window"),
        ("2. Nowcast & Alert", "GOES-class badge, duration tracker, Neupert correlation score"),
        ("3. Forecast & Precursor", "T(MK) & EM plots, probability bars for 5/10/30-min horizons"),
    ]
    for i, (title, desc) in enumerate(tiers):
        y = Inches(5.5) + Inches(i * 0.4)
        add_textbox(slide, Inches(6.8), y, Inches(5.7), Inches(0.35),
                    f"{title}: {desc}", font_size=9, font_color=LIGHT_GRAY, line_spacing=1.2)

    # Deployment badge
    deploy_card = add_rounded_rect(slide, Inches(0.6), Inches(6.55), Inches(5.7), Inches(0.7),
                                    RGBColor(0x0E, 0x35, 0x58))
    add_textbox(slide, Inches(0.8), Inches(6.6), Inches(5.3), Inches(0.6),
                "🐳  Deployed via Docker containers on ISSDC server clusters\n"
                "📦  CI/CD pipeline via GitHub Actions for continuous testing",
                font_size=10, font_color=ACCENT_TEAL, line_spacing=1.4)

    add_slide_number(slide, 13)


def build_slide_14_evaluation_metrics(prs):
    """Slide 14: Evaluation Metrics & Benchmarks"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 12, "EVALUATION METRICS & BENCHMARKS",
                       "Operational Performance Standards for Mission-Critical Deployment")

    # Metrics table
    table = add_table(slide, Inches(0.6), Inches(1.4), Inches(12.1), Inches(3.3), 6, 4)

    headers = ["Metric", "Formula", "Definition", "Target"]
    metrics_data = [
        ["POD / TPR", "TP / (TP + FN)", "Ability to capture real flares", "≥ 0.90"],
        ["FAR", "FP / (FP + TN)", "Frequency of false alerts", "≤ 0.20"],
        ["TSS", "TPR - FPR", "Primary space weather benchmark (-1 to 1)", "≥ 0.80"],
        ["HSS", "2(TP·TN - FP·FN) / ...", "Improvement over random baseline", "≥ 0.50"],
        ["Lead Time", "t_alert - t_peak", "Warning buffer for operators", "≥ 5 minutes"],
    ]

    for j, h in enumerate(headers):
        style_table_cell(table.cell(0, j), h, font_size=12, font_color=WHITE,
                         bold=True, bg_color=ISRO_ORANGE, alignment=PP_ALIGN.CENTER)

    for i, row_data in enumerate(metrics_data):
        bg = TABLE_ROW_EVEN if i % 2 == 0 else TABLE_ROW_ODD
        for j, cell_text in enumerate(row_data):
            fc = ISRO_BLUE if j == 0 else (ACCENT_TEAL if j == 3 else LIGHT_GRAY)
            fb = (j == 0 or j == 3)
            style_table_cell(table.cell(i + 1, j), cell_text,
                             font_size=11, font_color=fc, bold=fb,
                             bg_color=bg, alignment=PP_ALIGN.CENTER)

    # Benchmark comparison
    add_textbox(slide, Inches(0.6), Inches(4.9), Inches(5.5), Inches(0.4),
                "STATE-OF-THE-ART BENCHMARKS", font_size=15, font_color=ISRO_ORANGE, bold=True)
    add_accent_bar(slide, Inches(0.6), Inches(5.25), Inches(5.5), Inches(0.02), ISRO_ORANGE)

    benchmarks = [
        ("SolarFlareNet (2023)", "Transformer stack", "TSS = 0.84", "Abduallah et al., Scientific Reports"),
        ("CNN-TCN (2025)", "Hybrid temporal CNN", "TSS = 0.85", "Xu et al."),
        ("LSTM+Decomposition", "LSTM with signal decomp", "TSS = 0.68", "Hassani et al., ApJS 279"),
        ("HOPE Manual (2024)", "Precursor-based", "5–15 min lead", "arxiv:2509.05234"),
    ]

    for i, (model, arch, score, ref) in enumerate(benchmarks):
        y = Inches(5.45) + Inches(i * 0.45)
        add_textbox(slide, Inches(0.8), y, Inches(2.0), Inches(0.3),
                    model, font_size=10, font_color=ISRO_BLUE, bold=True)
        add_textbox(slide, Inches(2.8), y, Inches(1.8), Inches(0.3),
                    arch, font_size=9, font_color=LIGHT_GRAY)
        add_textbox(slide, Inches(4.5), y, Inches(1.3), Inches(0.3),
                    score, font_size=10, font_color=ACCENT_TEAL, bold=True)

    # Confusion matrix visual
    cm_card = add_rounded_rect(slide, Inches(6.6), Inches(4.9), Inches(6.0), Inches(2.3), CARD_BG)
    add_textbox(slide, Inches(6.8), Inches(5.0), Inches(5.6), Inches(0.35),
                "CONFUSION MATRIX FRAMEWORK", font_size=13, font_color=ACCENT_PURPLE, bold=True)
    add_accent_bar(slide, Inches(6.8), Inches(5.3), Inches(5.4), Inches(0.02), ACCENT_PURPLE)

    # Simple confusion matrix representation
    cm_data = [
        ("", "Predicted: Flare", "Predicted: No Flare"),
        ("Actual: Flare", "TP ✅", "FN ❌ (CRITICAL)"),
        ("Actual: No Flare", "FP ⚠️", "TN ✅"),
    ]
    for i, (label, val1, val2) in enumerate(cm_data):
        y = Inches(5.45) + Inches(i * 0.5)
        fc = MED_GRAY if i == 0 else LIGHT_GRAY
        fb = (i == 0)
        add_textbox(slide, Inches(6.8), y, Inches(2.0), Inches(0.35),
                    label, font_size=9, font_color=fc, bold=fb)
        add_textbox(slide, Inches(8.8), y, Inches(1.8), Inches(0.35),
                    val1, font_size=9, font_color=ACCENT_TEAL if "TP" in val1 else (ISRO_ORANGE if "FP" in val1 else MED_GRAY))
        add_textbox(slide, Inches(10.6), y, Inches(2.0), Inches(0.35),
                    val2, font_size=9, font_color=ACCENT_RED if "FN" in val2 else (ACCENT_TEAL if "TN" in val2 else MED_GRAY))

    add_slide_number(slide, 14)


def build_slide_15_tech_stack(prs):
    """Slide 15: Technology Stack"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 13, "TECHNOLOGY STACK",
                       "Open-Source Tools & Frameworks Powering the Pipeline")

    tech_categories = [
        ("📥  DATA I/O", [
            "Python 3.11+ (core language)",
            "Astropy — FITS parsing & WCS",
            "SunPy v6.x — solar data APIs",
            "SolexsLOODS — ISRO toolkit",
            "h5py — HDF5 file handling",
            "requests — PRADAN API calls",
        ], ISRO_ORANGE),
        ("📊  SIGNAL PROCESSING", [
            "NumPy — array operations",
            "SciPy — convolutions & filters",
            "Pandas — time-series alignment",
            "statsmodels — baseline estimation",
            "scikit-signal — QPP detection",
        ], ISRO_BLUE),
        ("🧠  MACHINE LEARNING", [
            "TensorFlow 2.x / PyTorch",
            "Optuna — hyperparameter tuning",
            "imbalanced-learn — SMOTE",
            "Focal Loss implementation",
            "ONNX — model portability",
        ], ACCENT_TEAL),
        ("📈  VISUALIZATION", [
            "Streamlit / Dash — web framework",
            "Plotly — interactive charts",
            "Bokeh — streaming renders",
            "Matplotlib — static plots",
            "Seaborn — statistical plots",
        ], ACCENT_PURPLE),
        ("🔧  DEVOPS & DATABASE", [
            "PostgreSQL — master catalogue",
            "Docker — containerization",
            "GitHub Actions — CI/CD",
            "Prometheus — monitoring",
            "FastAPI — REST endpoints",
        ], ACCENT_RED),
        ("📋  EVALUATION", [
            "scikit-learn — metrics",
            "NOAA SWPC — validation",
            "GOES XRS — ground truth",
            "MLflow — experiment tracking",
            "Custom TSS/HSS calculators",
        ], ACCENT_GOLD),
    ]

    for i, (category, tools, color) in enumerate(tech_categories):
        col = i % 3
        row = i // 3
        x = Inches(0.6) + Inches(col * 4.15)
        y = Inches(1.35) + Inches(row * 2.85)

        card = add_rounded_rect(slide, x, y, Inches(3.85), Inches(2.6), CARD_BG)
        add_accent_bar(slide, x, y, Inches(3.85), Inches(0.05), color)

        add_textbox(slide, x + Inches(0.2), y + Inches(0.15), Inches(3.45), Inches(0.35),
                    category, font_size=13, font_color=color, bold=True)
        add_accent_bar(slide, x + Inches(0.2), y + Inches(0.48), Inches(3.3), Inches(0.02), color)

        for j, tool in enumerate(tools):
            ty = y + Inches(0.6) + Inches(j * 0.3)
            add_textbox(slide, x + Inches(0.3), ty, Inches(3.3), Inches(0.25),
                        f"• {tool}", font_size=9, font_color=LIGHT_GRAY)

    add_slide_number(slide, 15)


def build_slide_16_expected_outcomes(prs):
    """Slide 16: Expected Outcomes"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 14, "EXPECTED OUTCOMES & DELIVERABLES",
                       "Quantifiable Results & Strategic Value Propositions")

    deliverables = [
        ("📋", "AUTOMATED FLARE\nCATALOGUE",
         "• Indigenous database of nowcasted solar flares\n"
         "• Combined SXR + HXR master catalogue\n"
         "• PostgreSQL storage + JSON/CSV export\n"
         "• UTC timestamps, peak flux, GOES class\n"
         "• Spectral indices & Neupert scores\n"
         "• First-of-its-kind from Indian mission data",
         ISRO_ORANGE),
        ("🧠", "TRAINED FORECASTING\nMODEL",
         "• 1D-CNN + BiLSTM + Transformer architecture\n"
         "• Quantifiable lead time ≥ 5 minutes\n"
         "• Multi-horizon probability outputs\n"
         "• Focal Loss for rare event sensitivity\n"
         "• ONNX-exportable for deployment\n"
         "• TSS ≥ 0.80 target performance",
         ISRO_BLUE),
        ("📊", "REAL-TIME\nDASHBOARD",
         "• Live SXR + HXR light curve visualization\n"
         "• Flare alert badges with GOES class\n"
         "• HOPE precursor temperature panel\n"
         "• Probability bars (5/10/30 min horizons)\n"
         "• Streamlit/Dash web interface\n"
         "• Containerized Docker deployment",
         ACCENT_TEAL),
        ("📄", "TECHNICAL\nDOCUMENTATION",
         "• Comprehensive system architecture manual\n"
         "• Algorithm specification documents\n"
         "• API documentation (FastAPI endpoints)\n"
         "• Peer-review-ready manuscripts\n"
         "• User training guides\n"
         "• Reproducible deployment playbooks",
         ACCENT_PURPLE),
    ]

    for i, (icon, title, desc, color) in enumerate(deliverables):
        col = i % 2
        row = i // 2
        x = Inches(0.6) + Inches(col * 6.25)
        y = Inches(1.35) + Inches(row * 2.85)

        card = add_rounded_rect(slide, x, y, Inches(5.95), Inches(2.6), CARD_BG)
        add_accent_bar(slide, x, y, Inches(0.06), Inches(2.6), color)

        # Icon + title
        add_textbox(slide, x + Inches(0.25), y + Inches(0.15), Inches(0.6), Inches(0.5),
                    icon, font_size=28, alignment=PP_ALIGN.CENTER)
        add_textbox(slide, x + Inches(0.85), y + Inches(0.15), Inches(4.5), Inches(0.55),
                    title, font_size=14, font_color=color, bold=True, line_spacing=1.15)
        add_accent_bar(slide, x + Inches(0.25), y + Inches(0.72), Inches(5.3), Inches(0.02), color)

        # Description
        add_textbox(slide, x + Inches(0.25), y + Inches(0.85), Inches(5.4), Inches(1.6),
                    desc, font_size=10, font_color=LIGHT_GRAY, line_spacing=1.3)

    add_slide_number(slide, 16)


def build_slide_17_roadmap(prs):
    """Slide 17: Implementation Roadmap"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 15, "IMPLEMENTATION ROADMAP",
                       "15-Week Phased Execution Plan with Key Milestones")

    phases = [
        ("PHASE 1", "Weeks 1–3", "DATA\nPREPROCESSING", [
            "PRADAN portal registration",
            "SoLEXS + HEL1OS FITS download",
            "Astropy FITS parsing pipeline",
            "HYPERMET calibration implementation",
            "GOES ground-truth label matching",
        ], ISRO_ORANGE),
        ("PHASE 2", "Weeks 4–6", "NOWCASTING\nALGORITHM", [
            "Sliding σ-threshold onset detector",
            "SXR derivative vs HXR Neupert validator",
            "Unified SXR+HXR Master Catalogue",
            "Validation against NOAA flare list",
            "Performance benchmarking",
        ], ISRO_BLUE),
        ("PHASE 3", "Weeks 7–10", "FORECASTING\nMODEL", [
            "Feature engineering (T, EM, ratios)",
            "HOPE precursor trigger encoding",
            "1D-CNN+BiLSTM+Transformer build",
            "Focal Loss + SMOTE implementation",
            "Hyperparameter tuning (Optuna)",
        ], ACCENT_TEAL),
        ("PHASE 4", "Weeks 11–13", "DASHBOARD &\nINTEGRATION", [
            "Streamlit/Dash GUI development",
            "Live streaming data wiring",
            "Visual/audio alert triggers",
            "End-to-end inference pipeline",
            "Docker containerization",
        ], ACCENT_PURPLE),
        ("PHASE 5", "Weeks 14–15", "REPORTING &\nDELIVERY", [
            "Database catalogue export",
            "Technical documentation",
            "Peer-review manuscripts",
            "User training materials",
            "Final system handover",
        ], ACCENT_RED),
    ]

    for i, (phase, weeks, title, tasks, color) in enumerate(phases):
        x = Inches(0.4) + Inches(i * 2.55)
        y = Inches(1.35)

        # Phase card
        card = add_rounded_rect(slide, x, y, Inches(2.35), Inches(5.4), CARD_BG)
        add_accent_bar(slide, x, y, Inches(2.35), Inches(0.06), color)

        # Phase header
        add_textbox(slide, x + Inches(0.1), y + Inches(0.15), Inches(2.15), Inches(0.25),
                    phase, font_size=10, font_color=color, bold=True, alignment=PP_ALIGN.CENTER)
        add_textbox(slide, x + Inches(0.1), y + Inches(0.4), Inches(2.15), Inches(0.25),
                    weeks, font_size=9, font_color=MED_GRAY, alignment=PP_ALIGN.CENTER)
        add_textbox(slide, x + Inches(0.1), y + Inches(0.65), Inches(2.15), Inches(0.55),
                    title, font_size=13, font_color=WHITE, bold=True,
                    alignment=PP_ALIGN.CENTER, line_spacing=1.15)

        add_accent_bar(slide, x + Inches(0.15), y + Inches(1.25), Inches(2.05), Inches(0.02), color)

        # Tasks
        for j, task in enumerate(tasks):
            ty = y + Inches(1.4) + Inches(j * 0.72)
            # Task dot
            add_textbox(slide, x + Inches(0.15), ty, Inches(2.05), Inches(0.6),
                        f"✓ {task}", font_size=8, font_color=LIGHT_GRAY, line_spacing=1.25)

    # Timeline bar at bottom
    bar_y = Inches(6.9)
    add_accent_bar(slide, Inches(0.6), bar_y, Inches(12.1), Inches(0.03), ISRO_ORANGE)
    timeline_labels = ["W1", "W3", "W4", "W6", "W7", "W10", "W11", "W13", "W14", "W15"]
    for i, label in enumerate(timeline_labels):
        x = Inches(0.5) + Inches(i * 1.3)
        add_textbox(slide, x, bar_y + Inches(0.05), Inches(0.8), Inches(0.25),
                    label, font_size=7, font_color=MED_GRAY, alignment=PP_ALIGN.CENTER)

    add_slide_number(slide, 17)


def build_slide_18_data_sources(prs):
    """Slide 18: Complete Data Sources Registry"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 16, "DATA SOURCES REGISTRY",
                       "Complete Reference of All Datasets, Portals & Research Papers")

    # Full sources table
    table = add_table(slide, Inches(0.6), Inches(1.35), Inches(12.1), Inches(5.5), 12, 3)

    headers = ["Source", "URL / Reference", "Description"]
    sources_data = [
        ["ISRO PRADAN Portal", "pradan.issdc.gov.in/al1", "SoLEXS + HEL1OS Level-1 FITS data"],
        ["ISSDC Main Archive", "issdc.gov.in", "ISRO science data archive; bulk download"],
        ["GOES/XRS (NOAA)", "ngdc.noaa.gov/stp/satellite/goes/", "Ground-truth SXR labels since 1975"],
        ["RHESSI Catalogue", "hesperia.gsfc.nasa.gov/rhessi3/", "HXR flare imaging catalogue"],
        ["Fermi/GBM", "hesperia.gsfc.nasa.gov/fermi/", "Gamma-ray burst monitor solar data"],
        ["SDO Data Archive", "sdo.gsfc.nasa.gov/data/", "EUV imagery + magnetograms"],
        ["NOAA SWPC", "swpc.noaa.gov", "Real-time space weather alerts"],
        ["SunPy Library", "docs.sunpy.org", "Python APIs for solar data access"],
        ["NJIT Solar Flares", "solarflare.njit.edu", "Academic solar flare research portal"],
        ["SoLEXS Paper", "arxiv.org/abs/2509.26292", "Ground calibration & in-flight performance"],
        ["HEL1OS Paper", "arxiv.org/abs/2512.12679", "Hard X-ray spectrometer architecture"],
    ]

    for j, h in enumerate(headers):
        style_table_cell(table.cell(0, j), h, font_size=11, font_color=WHITE,
                         bold=True, bg_color=ISRO_ORANGE, alignment=PP_ALIGN.CENTER)

    for i, row_data in enumerate(sources_data):
        bg = TABLE_ROW_EVEN if i % 2 == 0 else TABLE_ROW_ODD
        for j, cell_text in enumerate(row_data):
            fc = ISRO_BLUE if j == 0 else (ACCENT_TEAL if j == 1 else LIGHT_GRAY)
            fb = (j == 0)
            style_table_cell(table.cell(i + 1, j), cell_text,
                             font_size=9, font_color=fc, bold=fb,
                             bg_color=bg, alignment=PP_ALIGN.LEFT)

    add_slide_number(slide, 18)


def build_slide_19_conclusions(prs):
    """Slide 19: Strategic Conclusions"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)
    add_section_header(slide, 17, "STRATEGIC CONCLUSIONS",
                       "Sovereign Capability & Future Impact Assessment")

    conclusions = [
        ("🛰️", "Sovereign Monitoring",
         "First indigenous solar flare catalogue derived entirely from an Indian space mission — "
         "establishing data sovereignty in space weather intelligence"),
        ("⚡", "Dual-Band Synergy",
         "SoLEXS (thermal) + HEL1OS (non-thermal) synergy captures the complete flare lifecycle, "
         "enabling Neupert Effect cross-validation to eliminate false alarms"),
        ("🔬", "Physics-Driven Prediction",
         "HOPE precursor technique provides 5–15 minute physics-based early warning — "
         "extracted from real-time plasma temperature and emission measure monitoring"),
        ("🧠", "AI-Powered Forecasting",
         "Transformer self-attention architecture exceeds traditional LSTM limitations, "
         "targeting TSS ≥ 0.80 and FAR ≤ 0.20 for mission-critical reliability"),
        ("🛡️", "Infrastructure Protection",
         "Provides satellite operators, aviation authorities, and power grid managers "
         "the vital temporal buffer to protect 50+ critical national space assets"),
        ("📊", "Scalable Architecture",
         "Containerized, open-source pipeline deployable on ISSDC infrastructure — "
         "designed for continuous operation throughout Solar Cycle 25 and beyond"),
    ]

    for i, (icon, title, desc) in enumerate(conclusions):
        col = i % 2
        row = i // 2
        x = Inches(0.6) + Inches(col * 6.25)
        y = Inches(1.35) + Inches(row * 1.7)

        card = add_rounded_rect(slide, x, y, Inches(5.95), Inches(1.5), CARD_BG)
        colors = [ISRO_ORANGE, ISRO_BLUE, ACCENT_TEAL, ACCENT_PURPLE, ACCENT_RED, ACCENT_GOLD]
        color = colors[i]
        add_accent_bar(slide, x, y, Inches(0.06), Inches(1.5), color)

        add_textbox(slide, x + Inches(0.2), y + Inches(0.1), Inches(0.5), Inches(0.4),
                    icon, font_size=22, alignment=PP_ALIGN.CENTER)
        add_textbox(slide, x + Inches(0.75), y + Inches(0.1), Inches(4.8), Inches(0.35),
                    title, font_size=14, font_color=color, bold=True)
        add_textbox(slide, x + Inches(0.75), y + Inches(0.45), Inches(5.0), Inches(0.9),
                    desc, font_size=10, font_color=LIGHT_GRAY, line_spacing=1.35)

    # Bottom impact strip
    kpi_strip = add_rounded_rect(slide, Inches(0.6), Inches(6.45), Inches(12.1), Inches(0.85),
                                  RGBColor(0x0E, 0x35, 0x58))
    kpis = [
        ("5–15 min", "Prediction\nLead Time"),
        ("1–150 keV", "Energy\nCoverage"),
        ("TSS ≥ 0.80", "Skill Score\nTarget"),
        ("24/7", "Continuous\nMonitoring"),
        ("50+", "Satellites\nProtected"),
    ]
    for i, (val, label) in enumerate(kpis):
        x = Inches(0.9) + Inches(i * 2.45)
        add_textbox(slide, x, Inches(6.5), Inches(1.5), Inches(0.35),
                    val, font_size=16, font_color=ISRO_ORANGE, bold=True,
                    alignment=PP_ALIGN.CENTER)
        add_textbox(slide, x, Inches(6.82), Inches(1.5), Inches(0.4),
                    label, font_size=8, font_color=MED_GRAY,
                    alignment=PP_ALIGN.CENTER, line_spacing=1.1)

    add_slide_number(slide, 19)


def build_slide_20_closing(prs):
    """Slide 20: Closing / Thank You"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DEEP_NAVY)

    # Full-width accent bars
    add_shape(slide, MSO_SHAPE.RECTANGLE,
              Inches(0), Inches(0), SLIDE_WIDTH, Inches(0.05), fill_color=ISRO_ORANGE)
    add_shape(slide, MSO_SHAPE.RECTANGLE,
              Inches(0), Inches(7.42), SLIDE_WIDTH, Inches(0.08), fill_color=ISRO_ORANGE)
    # Left accent strip
    add_shape(slide, MSO_SHAPE.RECTANGLE,
              Inches(0), Inches(0), Inches(0.08), SLIDE_HEIGHT, fill_color=ISRO_ORANGE)

    # Central content
    add_multiline_textbox(
        slide, Inches(1.5), Inches(1.5), Inches(10), Inches(2),
        [
            ("Sovereign Space Weather", 40, WHITE, True, PP_ALIGN.CENTER),
            ("Resilience", 40, ISRO_ORANGE, True, PP_ALIGN.CENTER),
            ("", 12, WHITE, False, PP_ALIGN.CENTER),
            ("Protecting India's Critical Space & Terrestrial Infrastructure", 18, LIGHT_GRAY, False, PP_ALIGN.CENTER),
        ],
        line_spacing=1.3
    )

    # Divider
    add_accent_bar(slide, Inches(4.5), Inches(3.8), Inches(4.3), Inches(0.03), ISRO_ORANGE)

    # Key message
    add_textbox(slide, Inches(2), Inches(4.1), Inches(9.3), Inches(0.6),
                "From Reactive Monitoring → Predictive, Automated Forecasting",
                font_size=20, font_color=SUBTITLE_GOLD, bold=True, alignment=PP_ALIGN.CENTER)

    # Attribution
    add_multiline_textbox(
        slide, Inches(2), Inches(5.0), Inches(9.3), Inches(1.5),
        [
            ("Indian Space Research Organisation", 14, ISRO_BLUE, True, PP_ALIGN.CENTER),
            ("Department of Space  •  Government of India", 12, MED_GRAY, False, PP_ALIGN.CENTER),
            ("", 8, WHITE, False, PP_ALIGN.CENTER),
            ("Aditya-L1 Mission  •  SoLEXS + HEL1OS Payloads", 11, LIGHT_GRAY, False, PP_ALIGN.CENTER),
            ("Problem Statement 15  •  Solar Flare Nowcasting & Forecasting", 11, LIGHT_GRAY, False, PP_ALIGN.CENTER),
        ],
        line_spacing=1.5
    )

    # Contact / reference
    add_textbox(slide, Inches(3), Inches(6.5), Inches(7.3), Inches(0.5),
                "Data Portal: pradan.issdc.gov.in/al1  |  Archive: issdc.gov.in",
                font_size=10, font_color=MED_GRAY, alignment=PP_ALIGN.CENTER)


# ────────────────────────────────────────────────────────────────
# MAIN EXECUTION
# ────────────────────────────────────────────────────────────────

def main():
    prs = Presentation()

    # Set widescreen 16:9
    prs.slide_width = SLIDE_WIDTH
    prs.slide_height = SLIDE_HEIGHT

    print("[*] Building ISRO Solar Flare Presentation...")
    print("=" * 60)

    slides = [
        ("01", "Cover / Title Slide", build_slide_01_cover),
        ("02", "Presentation Agenda", build_slide_02_agenda),
        ("03", "Strategic Imperative", build_slide_03_strategic_imperative),
        ("04", "Mission & Instrumentation", build_slide_04_mission),
        ("05", "Solar Flare Physics", build_slide_05_flare_physics),
        ("06", "Flare Classification", build_slide_06_classification),
        ("07", "Dataset Acquisition", build_slide_07_dataset),
        ("08", "Data Engineering Pipeline", build_slide_08_data_engineering),
        ("09", "Nowcasting Algorithm", build_slide_09_nowcasting),
        ("10", "HOPE Precursor Technique", build_slide_10_hope),
        ("11", "Forecasting Model", build_slide_11_forecasting_model),
        ("12", "Class Imbalance & Outputs", build_slide_12_class_imbalance),
        ("13", "System Architecture", build_slide_13_system_architecture),
        ("14", "Evaluation Metrics", build_slide_14_evaluation_metrics),
        ("15", "Technology Stack", build_slide_15_tech_stack),
        ("16", "Expected Outcomes", build_slide_16_expected_outcomes),
        ("17", "Implementation Roadmap", build_slide_17_roadmap),
        ("18", "Data Sources Registry", build_slide_18_data_sources),
        ("19", "Strategic Conclusions", build_slide_19_conclusions),
        ("20", "Closing", build_slide_20_closing),
    ]

    for num, name, builder in slides:
        print(f"  [+] Slide {num}: {name}")
        builder(prs)

    output_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "SolarFlare_Nowcasting_Forecasting_Aditya_L1.pptx"
    )
    prs.save(output_path)
    print("=" * 60)
    print(f"[OK] Presentation saved to: {output_path}")
    print(f"[OK] Total slides: {len(slides)}")
    print("=" * 60)


if __name__ == "__main__":
    main()
