from rest_framework import serializers

from .models import League, Match, Player


class LeagueSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = ["id", "name"]


class PlayerSerializer(serializers.ModelSerializer):
    leagues = LeagueSummarySerializer(many=True, read_only=True)
    # leagues = serializers.PrimaryKeyRelatedField(
    #     many=True, queryset=League.objects.all()
    # )

    class Meta:
        model = Player
        fields = "__all__"

    # def create(self, validated_data):
    #     leagues_data = validated_data.pop('leagues', [])
    #     player = Player.objects.create(**validated_data)
    #     player.leagues.set(leagues_data)
    #     return player


class LeagueSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = League
        fields = "__all__"


class MatchSerializer(serializers.ModelSerializer):
    players = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Player.objects.all(),  # writeできるようにする
    )

    class Meta:
        model = Match
        fields = "__all__"

    def create(self, validated_data):
        players_data = validated_data.pop("players", [])
        match = Match.objects.create(**validated_data)
        match.players.set(players_data)
        return match
    