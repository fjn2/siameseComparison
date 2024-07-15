import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import datasets, layers, Model, Input
import matplotlib.pyplot as plt
import numpy as np
import numpy
import pandas as pd
import os

from PIL import Image

width=224
height=224

TRAINING_CSV_FILE = '../datasets/wheels/training.csv'
TRAINING_IMAGE_DIR = '../datasets/wheels/training'
VALIDATION_CSV_FILE = '../datasets/wheels/validation.csv'
VALIDATION_IMAGE_DIR = '../datasets/wheels/validation'

class_names = ['no-wide', 'wide-wheel']

################## extract training images
training_image_records = pd.read_csv(TRAINING_CSV_FILE)
train_image_path = os.path.join(os.getcwd(), TRAINING_IMAGE_DIR)

train_images = []
train_targets = []
train_labels = []

for index, row in training_image_records.iterrows():
    
    (image_name,class_name) = row
    
    train_image_fullpath = os.path.join(train_image_path, image_name)
    train_img = keras.preprocessing.image.load_img(train_image_fullpath, target_size=(height, width))
    train_img_arr = keras.preprocessing.image.img_to_array(train_img).astype(numpy.uint8)
    
    # xmin = round(xmin/ width, 2)
    # ymin = round(ymin/ height, 2)
    # xmax = round(xmax/ width, 2)
    # ymax = round(ymax/ height, 2)
    
    train_images.append(train_img_arr)
    # train_targets.append((xmin, ymin, xmax, ymax))
    train_labels.append(class_names.index(class_name))

train_targets = np.array(train_targets)
train_labels = np.array(train_labels)
train_images = np.array(train_images)

################## extract validation images
validation_image_records = pd.read_csv(TRAINING_CSV_FILE)
validation_image_path = os.path.join(os.getcwd(), TRAINING_IMAGE_DIR)

validation_images = []
validation_targets = []
validation_labels = []

for index, row in training_image_records.iterrows():
    
    (filename, class_name) = row
    
    validation_image_fullpath = os.path.join(validation_image_path, filename)
    validation_img = keras.preprocessing.image.load_img(validation_image_fullpath, target_size=(height, width))
    validation_img_arr = keras.preprocessing.image.img_to_array(validation_img).astype(numpy.uint8)
    
    # xmin = round(xmin/ width, 2)
    # ymin = round(ymin/ height, 2)
    # xmax = round(xmax/ width, 2)
    # ymax = round(ymax/ height, 2)
    
    validation_images.append(validation_img_arr)
    # validation_targets.append((xmin, ymin, xmax, ymax))
    validation_labels.append(class_names.index(class_name))

validation_images = np.array(validation_images)
validation_targets = np.array(validation_targets)
validation_labels = np.array(validation_labels)

################## end extract validation images

# result = Image.fromarray((train_images[7] * 255).astype(numpy.uint8), mode='RGB')
# result.save('out.bmp')

# plt.figure(figsize=(10,10))
# for i in range(25):
#     plt.subplot(5,5,i+1)
#     plt.xticks([])
#     plt.yticks([])
#     plt.grid(False)
#     plt.imshow(test_images[i])
#     # The CIFAR labels happen to be arrays, 
#     # which is why you need the extra index
    # plt.xlabel(class_names[test_labels[i][0]])
# plt.show()

input_layer = Input(shape=(width, height, 3))

base_layers= layers.MaxPooling2D((2, 2))(input_layer)
base_layers = layers.Conv2D(64, (3, 3), activation='relu')(base_layers)
base_layers = layers.MaxPooling2D((2, 2))(base_layers)
base_layers = layers.Conv2D(64, (3, 3), activation='relu')(base_layers)

base_layers = layers.Flatten()(base_layers)

# classification layers
classification_layers = layers.Dense(64, activation='relu')(base_layers)
classification_layers = layers.Dense(len(class_names), activation='softmax', name='cl_head')(classification_layers) # output classification

# localization layers
# locator_branch = layers.Dense(128, activation='relu', name='bb_1')(base_layers)
# locator_branch = layers.Dense(64, activation='relu', name='bb_2')(locator_branch)
# locator_branch = layers.Dense(32, activation='relu', name='bb_3')(locator_branch)
# locator_branch = layers.Dense(4, activation='sigmoid', name='bb_head')(locator_branch)

model = Model(inputs=input_layer, outputs=[
    classification_layers,
    # locator_branch
])

model.summary()


losses =  {
    "cl_head":tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    # "bb_head":tf.keras.losses.MSE
}

model.compile(optimizer='adam',
              loss=losses,
              metrics=['accuracy', 'accuracy'])

# print(train_labels)


trainTargets = {
    "cl_head": train_labels,
    # "bb_head": train_targets
}

validationTargets = {
    "cl_head": validation_labels,
    # "bb_head": validation_targets
}

# print(len(validation_images))
# print(len(validation_targets))
# print(len(validation_labels))


history = model.fit(train_images, trainTargets, epochs=1, 
                    validation_data=(validation_images, validationTargets)
                )

# plt.plot(history.history['accuracy'], label='accuracy')
# plt.plot(history.history['val_accuracy'], label = 'val_accuracy')
# plt.xlabel('Epoch')
# plt.ylabel('Accuracy')
# plt.ylim([0.5, 1])
# plt.legend(loc='lower right')

resp = model.evaluate(validation_images, validation_labels, verbose=2)

print(resp)


model.save('image25_classification.h5')