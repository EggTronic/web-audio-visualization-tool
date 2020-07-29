### OO Design of Canvas Elements
- There are 2 types of element:
  1. None interactable element
     - Those are elements without events, purely render on canvas based on data of each frame.
     - render method should take following inputs:
        1. audio buffer status
        2. audio play/pause status
        3. audio currentTime
        4. audio totalTime
        5. canvas context
        6. canvas width
        7. canvas height
        8. audio meta data {song name, artist name}

  2. Interactable element
     - Those are elements can bind click events to control the audio play
     - render method should take following inputs:
        1. reference of a AudioVisualizer object
