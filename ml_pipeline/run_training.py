import os
import torch
import pandas as pd
from torch.utils.data import Dataset, DataLoader
from models.hybrid import SolarFlareNet
from train import train_model

class HistoricalFlareDataset(Dataset):
    def __init__(self, csv_file, seq_len=30):
        self.seq_len = seq_len
        df = pd.read_csv(csv_file)
        
        self.samples = []
        self.targets = []
        
        # Group by sample_id to extract sequences
        grouped = df.groupby("sample_id")
        for name, group in grouped:
            if len(group) == self.seq_len:
                # Extract features: temperature_mk, emission_measure, dF_dt
                features = group[["temperature_mk", "emission_measure", "dF_dt"]].values
                target = group["target_class"].iloc[0]
                
                self.samples.append(torch.tensor(features, dtype=torch.float32))
                self.targets.append(torch.tensor(target, dtype=torch.long))
                
    def __len__(self):
        return len(self.samples)
        
    def __getitem__(self, idx):
        return self.samples[idx], self.targets[idx]

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, "historical_flares.csv")
    model_path = os.path.join(script_dir, "models", "solarflarenet.pt")
    
    if not os.path.exists(csv_path):
        print("Historical dataset not found. Please run historical_data_generator.py first.")
        return
        
    print(f"Loading dataset from {csv_path}...")
    dataset = HistoricalFlareDataset(csv_path, seq_len=30)
    
    # Split into train/val (80/20)
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)
    
    print(f"Training on {train_size} samples, validating on {val_size} samples.")
    
    # Initialize Model (3 features, seq_len=30, 5 classes)
    model = SolarFlareNet(input_features=3, sequence_length=30, num_classes=5)
    
    # Train the model
    train_model(model, train_loader, val_loader, epochs=5)
    
    # Save the model
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    torch.save(model.state_dict(), model_path)
    print(f"Model successfully trained and saved to {model_path}!")

if __name__ == "__main__":
    main()
