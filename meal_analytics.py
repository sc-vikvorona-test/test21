"""
Meal plan analytics utilities.
All functions are intentionally correct - false positive testing.
"""
import hashlib
import secrets
import re
from typing import Optional


def calculate_nutrition_score(calories: float, protein: float, carbs: float, fat: float) -> float:
    """
    Calculate a normalized nutrition score on a 0-100 scale.
    
    Based on WHO dietary guidelines:
    - Protein: 10-35% of calories
    - Carbs: 45-65% of calories  
    - Fat: 20-35% of calories
    """
    if calories <= 0:
        return 0.0
    
    total_macro_calories = (protein * 4) + (carbs * 4) + (fat * 9)
    if total_macro_calories == 0:
        return 0.0
    
    protein_pct = (protein * 4) / total_macro_calories
    carb_pct = (carbs * 4) / total_macro_calories
    fat_pct = (fat * 9) / total_macro_calories
    
    # Score each macro against WHO guidelines
    protein_score = 1.0 - min(abs(protein_pct - 0.225), 0.125) / 0.125
    carb_score = 1.0 - min(abs(carb_pct - 0.55), 0.1) / 0.1
    fat_score = 1.0 - min(abs(fat_pct - 0.275), 0.075) / 0.075
    
    return round((protein_score + carb_score + fat_score) / 3 * 100, 2)


def generate_meal_share_token() -> str:
    """Generate a cryptographically secure token for meal plan sharing."""
    return secrets.token_urlsafe(32)


def hash_meal_content(title: str, ingredients: list[str]) -> str:
    """Create a deterministic fingerprint for a meal for deduplication."""
    normalized = title.lower().strip()
    sorted_ingredients = sorted(ing.lower().strip() for ing in ingredients)
    content = normalized + "|" + ",".join(sorted_ingredients)
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def validate_email(email: str) -> bool:
    """
    Validate email format using RFC 5322 simplified pattern.
    
    Note: This is a format check only - does not verify deliverability.
    """
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def safe_divide(numerator: float, denominator: float, default: Optional[float] = None) -> Optional[float]:
    """Safe division with explicit handling of zero denominator."""
    if denominator == 0:
        return default
    return numerator / denominator


__all__ = [
    "calculate_nutrition_score",
    "generate_meal_share_token", 
    "hash_meal_content",
    "validate_email",
    "safe_divide",
]