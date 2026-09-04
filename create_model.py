# ...existing code...
import json
import os
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.optimizers import Adam

# إعداد بسيط لموديل تجريبي (هيكلي فقط)
input_shape = (224, 224, 3)
num_classes = 4
labels = ["OK", "Crack", "Scratch", "Contamination"]

model = Sequential([
    Conv2D(8, (3,3), activation='relu', input_shape=input_shape),
    MaxPooling2D((2,2)),
    Conv2D(16, (3,3), activation='relu'),
    MaxPooling2D((2,2)),
    Flatten(),
    Dense(32, activation='relu'),
    Dense(num_classes, activation='softmax')
])

model.compile(optimizer=Adam(1e-3), loss='categorical_crossentropy')

model_path = "model.h5"
labels_path = "labels.json"

model.save(model_path)
with open(labels_path, "w", encoding="utf-8") as f:
    json.dump(labels, f, ensure_ascii=False)

print("Saved demo model to", model_path)
print("Saved labels to", labels_path)
# ...existing code...