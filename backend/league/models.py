from django.db import models


# Create your models here.
class League(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Player(models.Model):
    name = models.CharField(max_length=100)
    leagues = models.ManyToManyField(
        League, related_name="players", blank=True
    )  # プレイヤーが参加するリーグ
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# class PlayerLeagueStat(models.Model):
#     player = models.ForeignKey(Player, on_delete=models.CASCADE)
#     league = models.ForeignKey(League, on_delete=models.CASCADE)
#     score = models.IntegerField(default=0)

#     class Meta:
#         unique_together = ("player", "league")


class Match(models.Model):
    league = models.ForeignKey(League, on_delete=models.CASCADE, related_name="matches")
    date = models.DateField()

    def __str__(self):
        return f"Match in {self.league.name} on {self.date}"
    
class MatchPlayerStat(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='player_stats')
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    score = models.IntegerField()
    
    class Meta:
        unique_together = ('match', 'player')
