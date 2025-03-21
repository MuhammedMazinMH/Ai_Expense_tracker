from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import numpy as np

class ExpenseCategorizer:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.model = MultinomialNB()
        
        # Initial training data
        self.train_basic_model()
    
    def train_basic_model(self):
        # Sample training data with expanded categories
        descriptions = [
            # Food & Groceries
            "grocery store purchase", "supermarket", "fruits and vegetables", "food store", "meat", "dairy",
            # Dining
            "restaurant bill", "cafe", "coffee shop", "fast food", "takeout", "delivery food",
            # Transportation
            "gas station", "fuel", "bus ticket", "train fare", "taxi ride", "car maintenance", "parking fee",
            # Shopping
            "clothing store", "mall purchase", "online shopping", "retail store", "department store",
            # Entertainment
            "movie tickets", "cinema", "theater", "concert", "sports event", "streaming service",
            # Utilities
            "electricity bill", "water bill", "gas bill", "internet service", "phone bill",
            # Healthcare
            "doctor visit", "medicine", "pharmacy", "medical test", "dental care", "health insurance",
            # Education
            "tuition fee", "textbooks", "school supplies", "online course", "training program",
            # Rent/Housing
            "rent payment", "apartment lease", "housing maintenance", "property tax",
            # Fitness
            "gym membership", "fitness equipment", "sports gear", "workout class",
            # Electronics
            "computer purchase", "phone accessories", "electronic gadgets", "software subscription",
            # Travel
            "hotel booking", "flight tickets", "vacation package", "travel insurance",
            # Insurance
            "car insurance", "life insurance", "home insurance", "property insurance",
            # Subscriptions
            "magazine subscription", "digital subscription", "membership fee", "subscription box",
            # Gifts
            "birthday gift", "holiday present", "gift card", "charitable donation"
        ]
        
        categories = [
            # Food & Groceries
            "groceries", "groceries", "groceries", "groceries", "groceries", "groceries",
            # Dining
            "dining", "dining", "dining", "dining", "dining", "dining",
            # Transportation
            "transportation", "transportation", "transportation", "transportation", "transportation", "transportation", "transportation",
            # Shopping
            "shopping", "shopping", "shopping", "shopping", "shopping",
            # Entertainment
            "entertainment", "entertainment", "entertainment", "entertainment", "entertainment", "entertainment",
            # Utilities
            "utilities", "utilities", "utilities", "utilities", "utilities",
            # Healthcare
            "healthcare", "healthcare", "healthcare", "healthcare", "healthcare", "healthcare",
            # Education
            "education", "education", "education", "education", "education",
            # Rent/Housing
            "rent", "rent", "rent", "rent",
            # Fitness
            "fitness", "fitness", "fitness", "fitness",
            # Electronics
            "electronics", "electronics", "electronics", "electronics",
            # Travel
            "travel", "travel", "travel", "travel",
            # Insurance
            "insurance", "insurance", "insurance", "insurance",
            # Subscriptions
            "subscriptions", "subscriptions", "subscriptions", "subscriptions",
            # Gifts
            "gifts", "gifts", "gifts", "gifts"
        ]
        
        # Transform and train
        X = self.vectorizer.fit_transform(descriptions)
        self.model.fit(X, categories)
    
    def predict(self, description: str) -> str:
        # Transform new description
        X_new = self.vectorizer.transform([description])
        
        # Predict category
        prediction = self.model.predict(X_new)
        return prediction[0]
