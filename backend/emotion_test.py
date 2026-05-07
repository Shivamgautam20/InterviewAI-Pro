import cv2
from deepface import DeepFace

# Open webcam
cap = cv2.VideoCapture(0)

while True:

    # Read frame
    ret, frame = cap.read()

    if not ret:
        break

    try:

        # Analyze emotions
        result = DeepFace.analyze(
            frame,
            actions=['emotion'],
            enforce_detection=False
        )

        # Emotion scores
        emotion_scores = result[0]['emotion']

        # Best emotion
        emotion = max(
            emotion_scores,
            key=emotion_scores.get
        )

        # Confidence %
        confidence = emotion_scores[emotion]

        # Display text
        text = f"Emotion: {emotion} ({confidence:.1f}%)"

        # Put text on webcam
        cv2.putText(
            frame,
            text,
            (20, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

    except Exception as e:
        print(e)

    # Show webcam
    cv2.imshow("AI Emotion Detection", frame)

    # Press Q to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release webcam
cap.release()

# Close windows
cv2.destroyAllWindows()