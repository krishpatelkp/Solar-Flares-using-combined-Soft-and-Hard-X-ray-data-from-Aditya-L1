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
        
    def forward(self, x, return_attention: bool = False):
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
        
        if return_attention:
            # Layer 0 forward
            h = self.transformer.layers[0](lstm_out)
            # Layer 1 forward with attention weights
            attn_layer = self.transformer.layers[1]
            attn_out, attn_weights = attn_layer.self_attn(h, h, h, need_weights=True, average_attn_weights=True)
            h2 = attn_layer.norm1(h + attn_layer.dropout1(attn_out))
            trans_out = attn_layer.norm2(h2 + attn_layer.dropout2(attn_layer.linear2(attn_layer.dropout(attn_layer.activation(attn_layer.linear1(h2))))))
            out = trans_out[:, -1, :]
            logits = self.fc(out)
            return logits, attn_weights[:, -1, :]
        else:
            # Transformer
            trans_out = self.transformer(lstm_out)
            out = trans_out[:, -1, :]
            return self.fc(out)

