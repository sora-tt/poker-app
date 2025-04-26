from django.shortcuts import render
from rest_framework import viewsets
from .models import League
from .serializers import LeagueSerializer

# Create your views here.

class LeagueViewSet(viewsets.ModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer
    
