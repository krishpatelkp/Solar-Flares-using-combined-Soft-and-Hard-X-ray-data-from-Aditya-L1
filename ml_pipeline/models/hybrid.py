"""
Phase 4: Forecasting Model Development
Deep Learning architectures (SolarFlareNet hybrid).
"""
import torch
import torch.nn as nn

class SolarFlareNet(nn.Module):
    """
    Hybrid model integrating 1D-CNN, BiLSTM, and Transformer encoder blocks.
    Modeled after state-of-the-art predictive architectures.
    """
    def __init__(self, input_features: int, sequence_length: int, num_classes: int):
        super(SolarFlareNet, self).__init__()
        
        # 1. Local Feature Extraction (Conv1D)
        self.conv1 = nn.Conv1d(in_channels=input_features, out_channels=64, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm1d(64)
        self.relu = nn.ReLU()
        
        # 2. Temporal Dependencies (BiLSTM)
        # Note: Conv1d expects (batch, channels, seq_len) but LSTM expects (batch, seq_len, features)
        self.lstm = nn.LSTM(input_size=64, hidden_size=128, batch_first=True, bidirectional=True)
        self.bn2 = nn.BatchNorm1d(256) # 128 * 2 for bidirectional
        
        # 3. Long-range Dependencies (Transformer Encoder)
        encoder_layer = nn.TransformerEncoderLayer(d_model=256, nhead=8, batch_first=True)
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=2)
        
        # 4. Output Classifier
        self.fc = nn.Linear(256, num_classes)
        
    def forward(self, x):
        # x shape: (batch, seq_len, features) -> Permute for Conv1d
        x = x.permute(0, 2, 1)
        x = self.relu(self.bn1(self.conv1(x)))
        
        # Permute back for LSTM
        x = x.permute(0, 2, 1)
        lstm_out, _ = self.lstm(x)
        
        # Apply BatchNorm (permute to match BatchNorm1d expectation)
        lstm_out = lstm_out.permute(0, 2, 1)
        lstm_out = self.bn2(lstm_out)
        lstm_out = lstm_out.permute(0, 2, 1)
        
        # Transformer
        trans_out = self.transformer(lstm_out)
        
        # Pooling (take the last sequence element)
        out = trans_out[:, -1, :]
        
        # Classification
        return self.fc(out)
