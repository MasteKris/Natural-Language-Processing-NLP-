"""
Definition of views.
"""

from datetime import datetime
from django.shortcuts import render
from django.http import HttpRequest

def home(request):
    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/index.html',
        {
            'title':'Home Page',
            'year':datetime.now().year,
        }
    )
#20
def contact(request):
    """Renders the contact page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/contact.html',
        {
            'title':'Contact',
            'message':'Your contact page.',
            'year':datetime.now().year,
        }
    )

def about(request):
    """Renders the about page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/about.html',
        {
            'title':'About',
            'message':'Your application description page.',
            'year':datetime.now().year,
        }
    )

from django.http import JsonResponse
from langdetect import detect_langs

def detect_languages(request): #30
    text = request.GET.get('text', '')
    try:
        langs = detect_langs(text)
        detected_languages = [{'lang': lang.lang, 'prob': lang.prob} for lang in langs]
        return JsonResponse({'languages': detected_languages})
    except Exception as e:
        return JsonResponse({'error': str(e)})
    
from django.http import JsonResponse
from langdetect import detect
from django.views.decorators.csrf import csrf_exempt
import re
from django.shortcuts import render

def analyze_text(request):
    try:
        text = request.GET.get('text', '')
        if not isinstance(text, str):
            raise ValueError("Invalid input. Expected a string.")
        #20
        # Podzia³ tekstu na s³owa
        words = re.findall(r'\b\w+\b', text)

        # Iloœæ s³ów
        word_count = len(words)

        # Œrednia d³ugoœæ s³owa
        avg_word_length = sum(len(word) for word in words) / word_count if word_count > 0 else 0

        # Najkrótsze s³owo
        shortest_word = min(words, key=len, default="")

        # Najd³u¿sze s³owo
        longest_word = max(words, key=len, default="")

        # Detekcja jêzyka tekstu
        language = detect(text)

        # Wyniki
        results = { #20
            "word_count": word_count,
            "avg_word_length": avg_word_length,
            "shortest_word": shortest_word,
            "longest_word": longest_word,

        }

        return JsonResponse(results)
    except ValueError as ve:
        return JsonResponse({'error': str(ve)})
    except Exception as e:
        return JsonResponse({'error': str(e)})
    
import langid
def identify_language(text):
    lang, confidence = langid.classify(text)
    return lang

import re
import nltk
from nltk.probability import FreqDist
from collections import Counter, defaultdict
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def analyze_language(request):
    try:
        text = request.GET.get('text', '')
        if not isinstance(text, str):
            raise ValueError("Invalid input. Expected a string.")

        # Preprocess the text
        preprocessed_text = re.sub(r'[^a-zA-Z\s]', '', text.lower())

        # Tokenize the text into words
        words = nltk.word_tokenize(preprocessed_text)

        # Calculate word frequencies
        word_freqs = FreqDist(words)

        # Calculate character frequencies
        char_freqs = Counter(preprocessed_text)

        # Calculate trigram frequencies
        trigrams = nltk.everygrams(preprocessed_text.split(), 3)
        trigram_freqs = FreqDist(trigrams)

        # Define language-specific features
        english_char_freqs = Counter('''the quick brown fox jumps over the lazy dog''')
        english_trigrams = FreqDist(nltk.everygrams('''the quick brown fox jumps over the lazy dog'''.split(), 3))

        # Calculate feature similarity
        char_similarity = sum(min(char_freqs[c], english_char_freqs[c]) for c in set(char_freqs) & set(english_char_freqs)) / (sum(char_freqs.values()) + sum(english_char_freqs.values()))
        trigram_similarity = sum(min(trigram_freqs[t], english_trigrams[t]) for t in set(trigram_freqs) & set(english_trigrams)) / (sum(trigram_freqs.values()) + sum(english_trigrams.values()))

        # Calculate the final similarity score
        similarity_score = (char_similarity + trigram_similarity) / 2
        
        # Return the results as JSON
        results = {
            "word_frequencies": dict(word_freqs.most_common()),
            "character_frequencies": dict(char_freqs.most_common()),
            "trigram_frequencies": dict(trigram_freqs.most_common()),
            "similarity_score": similarity_score
        }

        return JsonResponse(results)
    except ValueError as ve:
        return JsonResponse({'error': str(ve)})
    except Exception as e:
        return JsonResponse({'error': str(e)})
