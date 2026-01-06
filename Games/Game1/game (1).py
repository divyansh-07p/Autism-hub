import pygame
import sys
import time

pygame.init()

# ------------------ SCREEN ------------------
WIDTH, HEIGHT = 900, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Zen Sorting Garden")

clock = pygame.time.Clock()
FPS = 60

# ------------------ COLORS ------------------
BG_COLOR = (235, 238, 240)
TEXT_COLOR = (70, 70, 70)

PASTELS = {
    "blue": (170, 200, 220),
    "green": (180, 215, 190),
    "pink": (220, 180, 200)
}

RED_FEEDBACK = (200, 80, 80)
GREEN_FEEDBACK = (140, 200, 160)
BOWL_OUTLINE = (150, 150, 150)

# ------------------ FONTS ------------------
font = pygame.font.SysFont("arial", 18)
title_font = pygame.font.SysFont("arial", 26)

# ------------------ CLASSES ------------------
class Stone:
    def __init__(self, x, y, color, name):
        self.radius = 22
        self.color = color
        self.name = name
        self.start_pos = (x, y)
        self.rect = pygame.Rect(x - self.radius, y - self.radius,
                                 self.radius * 2, self.radius * 2)
        self.dragging = False
        self.placed_correctly = False

    def draw(self):
        pygame.draw.circle(screen, self.color, self.rect.center, self.radius)

    def reset(self):
        self.rect.center = self.start_pos


class Bowl:
    def __init__(self, x, y, color, name):
        self.radius = 45
        self.color = color
        self.name = name
        self.center = (x, y)

    def draw(self, highlight=None):
        pygame.draw.circle(screen, self.color, self.center, self.radius)
        pygame.draw.circle(
            screen,
            highlight if highlight else BOWL_OUTLINE,
            self.center,
            self.radius,
            4 if highlight else 2
        )

    def contains(self, stone):
        dx = stone.rect.centerx - self.center[0]
        dy = stone.rect.centery - self.center[1]
        return (dx**2 + dy**2) ** 0.5 < self.radius


# ------------------ OBJECTS ------------------
stones = [
    Stone(200, 450, PASTELS["blue"], "blue"),
    Stone(300, 450, PASTELS["green"], "green"),
    Stone(400, 450, PASTELS["pink"], "pink"),
]

bowls = [
    Bowl(250, 250, PASTELS["blue"], "blue"),
    Bowl(450, 250, PASTELS["green"], "green"),
    Bowl(650, 250, PASTELS["pink"], "pink"),
]

# ------------------ FEEDBACK STATE ------------------
wrong_bowl = None
wrong_time = 0
SHOW_WRONG_DURATION = 1.2  # seconds

# ------------------ MAIN LOOP ------------------
running = True
dragged_stone = None

while running:
    clock.tick(FPS)
    screen.fill(BG_COLOR)

    # -------- EVENTS --------
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        elif event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            running = False

        elif event.type == pygame.MOUSEBUTTONDOWN:
            for stone in stones:
                if stone.rect.collidepoint(event.pos):
                    dragged_stone = stone
                    stone.dragging = True

        elif event.type == pygame.MOUSEBUTTONUP:
            if dragged_stone:
                placed = False
                for bowl in bowls:
                    if bowl.contains(dragged_stone):
                        if bowl.name == dragged_stone.name:
                            dragged_stone.rect.center = bowl.center
                            dragged_stone.placed_correctly = True
                        else:
                            wrong_bowl = bowl
                            wrong_time = time.time()
                            dragged_stone.reset()
                        placed = True
                if not placed:
                    dragged_stone.reset()

                dragged_stone.dragging = False
                dragged_stone = None

    # -------- DRAG UPDATE --------
    if dragged_stone and dragged_stone.dragging:
        dragged_stone.rect.center = pygame.mouse.get_pos()

    # -------- DRAW BOWLS --------
    for bowl in bowls:
        highlight = None
        if wrong_bowl == bowl and time.time() - wrong_time < SHOW_WRONG_DURATION:
            highlight = RED_FEEDBACK
        bowl.draw(highlight)

    # -------- DRAW STONES --------
    for stone in stones:
        stone.draw()

    # -------- CHECK COMPLETION --------
    all_correct = all(stone.placed_correctly for stone in stones)
    if all_correct:
        overlay = pygame.Surface((WIDTH, 60))
        overlay.fill(GREEN_FEEDBACK)
        overlay.set_alpha(180)
        screen.blit(overlay, (0, HEIGHT - 70))

        msg = font.render(
            "All stones are correctly placed. Take a calm breath 🌿",
            True,
            (40, 70, 50)
        )
        screen.blit(msg, (WIDTH // 2 - msg.get_width() // 2, HEIGHT - 50))

    # -------- INSTRUCTIONS --------
    instructions = [
        "Zen Sorting Garden",
        "Drag each stone into a bowl of the same color.",
        "Red outline = wrong bowl. Green message = all correct.",
        "No rush. No penalties.",
        "Press ESC to exit."
    ]

    y = 20
    for i, line in enumerate(instructions):
        text = title_font.render(line, True, TEXT_COLOR) if i == 0 \
            else font.render(line, True, TEXT_COLOR)
        screen.blit(text, (20, y))
        y += 30 if i == 0 else 22

    pygame.display.flip()

pygame.quit()
sys.exit()
