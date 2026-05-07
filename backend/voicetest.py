import speech_recognition as sr
import pyttsx3

# Voice engine
engine = pyttsx3.init()

# Recognizer
recognizer = sr.Recognizer()

with sr.Microphone() as source:

    print("Speak something...")

    audio = recognizer.listen(source)

    try:
        text = recognizer.recognize_google(audio)

        print("You said:", text)

        engine.say("You said " + text)

        engine.runAndWait()

    except:
        print("Sorry, could not understand.")