"""
Phase 4: Training Pipeline
Training loop with Optuna hyperparameter optimization stubs and Focal Loss.
"""
import torch
import torch.nn as nn
import logging

logger = logging.getLogger(__name__)

class FocalLoss(nn.Module):
    """Handles class imbalance for rare X-class flares."""
    def __init__(self, alpha=1, gamma=2):
        super(FocalLoss, self).__init__()
        self.alpha = alpha
        self.gamma = gamma
        self.ce = nn.CrossEntropyLoss(reduction='none')

    def forward(self, inputs, targets):
        ce_loss = self.ce(inputs, targets)
        pt = torch.exp(-ce_loss)
        focal_loss = self.alpha * (1 - pt) ** self.gamma * ce_loss
        return focal_loss.mean()

def train_model(model, train_loader, val_loader, epochs=10):
    logger.info("Starting training loop...")
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    criterion = FocalLoss()
    
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        for batch_x, batch_y in train_loader:
            optimizer.zero_grad()
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
            
        logger.info(f"Epoch {epoch+1}/{epochs} | Loss: {total_loss/len(train_loader):.4f}")
