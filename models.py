
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    tags = models.JSONField(default=list)
    image_url = models.URLField()
    link = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('Frontend', 'Frontend'),
        ('Backend', 'Backend'),
        ('DevOps', 'DevOps'),
        ('Tools', 'Tools'),
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    level = models.IntegerField(default=0) # 0-100

    def __str__(self):
        return f"{self.name} ({self.level}%)"

class Experience(models.Model):
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    period = models.CharField(max_length=100)
    description = models.JSONField(default=list) # List of bullet points

    def __str__(self):
        return f"{self.role} at {self.company}"
