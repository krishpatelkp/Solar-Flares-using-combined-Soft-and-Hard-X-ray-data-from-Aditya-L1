import numpy as np
import pandas as pd
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_synthetic_data(num_samples=1000, seq_len=30):
    """
    Generates synthetic historical solar flare data.
    Features per timestep: [temperature_mk, emission_measure, dF_dt]
    """
    logger.info(f"Generating {num_samples} samples of synthetic solar flare sequences...")
    
    data = []
    
    # Class distribution roughly mimicking reality (lots of small flares, few X-class)
    # 0: A (Quiet), 1: B, 2: C, 3: M, 4: X
    classes = np.random.choice([0, 1, 2, 3, 4], p=[0.5, 0.3, 0.15, 0.04, 0.01], size=num_samples)
    
    for i, flare_class in enumerate(classes):
        # Base values depending on flare class
        if flare_class == 0:
            base_t = np.random.uniform(1.0, 3.0)
            base_em = np.random.uniform(1e43, 1e44)
        elif flare_class == 1:
            base_t = np.random.uniform(3.0, 6.0)
            base_em = np.random.uniform(1e44, 1e45)
        elif flare_class == 2:
            base_t = np.random.uniform(6.0, 12.0)
            base_em = np.random.uniform(1e45, 1e46)
        elif flare_class == 3:
            base_t = np.random.uniform(12.0, 20.0)
            base_em = np.random.uniform(1e46, 1e47)
        else:
            base_t = np.random.uniform(20.0, 35.0)
            base_em = np.random.uniform(1e47, 1e49)
            
        for step in range(seq_len):
            # Introduce some temporal dynamics (e.g., rising profile)
            progress = step / seq_len
            current_t = base_t * (0.8 + 0.4 * progress) + np.random.normal(0, 0.5)
            current_em = base_em * (0.5 + 1.5 * progress) + np.random.normal(0, base_em * 0.1)
            dF_dt = (current_em * current_t) * 1e-48 * (progress) + np.random.normal(0, 0.01)
            
            data.append({
                "sample_id": i,
                "timestep": step,
                "temperature_mk": max(0.1, current_t),
                "emission_measure": max(1e42, current_em),
                "dF_dt": dF_dt,
                "target_class": flare_class
            })
            
    df = pd.DataFrame(data)
    
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, "historical_flares.csv")
    df.to_csv(output_path, index=False)
    logger.info(f"Saved synthetic dataset to {output_path}")

if __name__ == "__main__":
    generate_synthetic_data(num_samples=2000, seq_len=30)
