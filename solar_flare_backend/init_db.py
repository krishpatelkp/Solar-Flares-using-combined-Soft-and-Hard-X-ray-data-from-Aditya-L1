import sys
import os
from datetime import datetime, timezone, timedelta

# Add current directory to path so app can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import Base, engine, SessionLocal
from app.db import models

print("Initializing the SQLite Database...")
Base.metadata.create_all(bind=engine)

# Seed realistic Aditya-L1 SoLEXS & HEL1OS detected flares if table is empty
db = SessionLocal()
try:
    count = db.query(models.Flare).count()
    if count < 5:
        print("Seeding initial Master Flare Catalogue with Aditya-L1 events...")
        now = datetime.now(timezone.utc)
        seed_flares = [
            models.Flare(
                start_time=now - timedelta(days=1, hours=2, minutes=15),
                peak_time=now - timedelta(days=1, hours=2, minutes=5),
                end_time=now - timedelta(days=1, hours=1, minutes=45),
                duration_seconds=1800,
                goes_class="X1.4",
                peak_sxr_flux=1.4e-4,
                peak_hxr_flux=8.6e-5,
                neupert_score=0.94
            ),
            models.Flare(
                start_time=now - timedelta(days=2, hours=5, minutes=30),
                peak_time=now - timedelta(days=2, hours=5, minutes=18),
                end_time=now - timedelta(days=2, hours=4, minutes=50),
                duration_seconds=2400,
                goes_class="M5.7",
                peak_sxr_flux=5.7e-5,
                peak_hxr_flux=3.8e-5,
                neupert_score=0.91
            ),
            models.Flare(
                start_time=now - timedelta(days=3, hours=11, minutes=10),
                peak_time=now - timedelta(days=3, hours=11, minutes=2),
                end_time=now - timedelta(days=3, hours=10, minutes=35),
                duration_seconds=2100,
                goes_class="M2.1",
                peak_sxr_flux=2.1e-5,
                peak_hxr_flux=1.9e-5,
                neupert_score=0.87
            ),
            models.Flare(
                start_time=now - timedelta(days=4, hours=18, minutes=0),
                peak_time=now - timedelta(days=4, hours=17, minutes=52),
                end_time=now - timedelta(days=4, hours=17, minutes=30),
                duration_seconds=1800,
                goes_class="X2.8",
                peak_sxr_flux=2.8e-4,
                peak_hxr_flux=1.4e-4,
                neupert_score=0.97
            ),
            models.Flare(
                start_time=now - timedelta(days=5, hours=8, minutes=20),
                peak_time=now - timedelta(days=5, hours=8, minutes=12),
                end_time=now - timedelta(days=5, hours=7, minutes=55),
                duration_seconds=1500,
                goes_class="C9.2",
                peak_sxr_flux=9.2e-6,
                peak_hxr_flux=4.5e-6,
                neupert_score=0.79
            ),
            models.Flare(
                start_time=now - timedelta(days=6, hours=14, minutes=45),
                peak_time=now - timedelta(days=6, hours=14, minutes=38),
                end_time=now - timedelta(days=6, hours=14, minutes=15),
                duration_seconds=1800,
                goes_class="M1.2",
                peak_sxr_flux=1.2e-5,
                peak_hxr_flux=9.5e-6,
                neupert_score=0.82
            ),
        ]
        db.add_all(seed_flares)
        db.commit()
        print(f"Successfully seeded {len(seed_flares)} historical Aditya-L1 flare events!")
    else:
        print(f"Database already contains {count} flare entries.")
finally:
    db.close()

print("Database initialized successfully!")
