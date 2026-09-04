# train.py
import tensorflow as tf
import os
import argparse
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

def build_and_train(dataset_dir, img_size=(224,224), batch_size=32, epochs=10, output_dir="saved_model"):
    # Make datasets
    train_ds = tf.keras.preprocessing.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=img_size,
        batch_size=batch_size
    )
    val_ds = tf.keras.preprocessing.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=img_size,
        batch_size=batch_size
    )

    class_names = train_ds.class_names
    print("Class names:", class_names)

    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.05),
        layers.RandomZoom(0.05),
    ])

    base_model = MobileNetV2(input_shape=img_size + (3,), include_top=False, weights="imagenet")
    base_model.trainable = False  # fintune later if needed

    inputs = tf.keras.Input(shape=img_size + (3,))
    x = data_augmentation(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(len(class_names), activation="softmax")(x)
    model = models.Model(inputs, outputs)

    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
                  loss="sparse_categorical_crossentropy",
                  metrics=["accuracy"])

    os.makedirs(output_dir, exist_ok=True)
    ckpt = ModelCheckpoint(os.path.join(output_dir, "best_model.h5"),
                           save_best_only=True, monitor="val_accuracy", mode="max")
    es = EarlyStopping(patience=5, restore_best_weights=True)

    history = model.fit(train_ds, validation_data=val_ds, epochs=epochs, callbacks=[ckpt, es])

    # save final model (SavedModel format)
    model.save(os.path.join(output_dir, "defect_detector"))
    # save class names
    with open(os.path.join(output_dir, "classes.txt"), "w", encoding="utf-8") as f:
        for c in class_names:
            f.write(c + "\n")
    print("Training finished. Model and classes saved in", output_dir)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", required=True, help="Path to dataset folder")
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch", type=int, default=32)
    parser.add_argument("--out", default="saved_model")
    args = parser.parse_args()

    build_and_train(args.dataset, batch_size=args.batch, epochs=args.epochs, output_dir=args.out)
