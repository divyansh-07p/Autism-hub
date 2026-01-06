import pygame
import random
import sys
import time
import os

# ---------- SOUND FIX FOR WINDOWS ----------
pygame.mixer.pre_init(44100, -16, 2, 512)
pygame.init()

WIDTH, HEIGHT = 900, 600
WIN = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Bubble Pop 2 – Polished Edition")

FONT = pygame.font.SysFont("comicsans", 28)
BIG = pygame.font.SysFont("comicsans", 60)

WHITE = (255,255,255)
BLACK = (0,0,0)
BLUE = (130,190,255)
RED = (255,120,120)

clock = pygame.time.Clock()

TOTAL_TIME = 60
LIVES = 3

###################################################
# LOADING SYSTEM (SAFE WITH DEBUG)
###################################################
def load_img(name, size):
    try:
        img = pygame.image.load(name).convert_alpha()
        img = pygame.transform.smoothscale(img, size)
        print(f"[OK] Loaded image: {name}")
        return img
    except Exception as e:
        print(f"[FAIL] {name} -> {e}")
        return None

def load_sound(name):
    try:
        snd = pygame.mixer.Sound(name)
        print(f"[OK] Loaded sound: {name}")
        return snd
    except Exception as e:
        print(f"[FAIL] {name} -> {e}")
        return None

# ---------- LOAD ASSETS ----------
bubble_img = load_img("bubble_face.png",(90,90))
bomb_img = load_img("bomb_face.png",(90,90))

POP = load_sound("pop.wav")
BOOM = load_sound("explosion.wav")

try:
    pygame.mixer.music.load("bath_music.mp3")
    pygame.mixer.music.play(-1)
    print("[OK] Music loaded")
except Exception as e:
    print("[FAIL] Music ->", e)

# Background is optional, will use color instead
use_bg = False


###################################################
# PARTICLES
###################################################
class Particle:
    def __init__(self,x,y,color):
        self.x=x
        self.y=y
        self.size=random.randint(4,9)
        self.color=color
        self.vel=[random.randint(-4,4),random.randint(-4,4)]
        self.life=25

    def update(self):
        self.x+=self.vel[0]
        self.y+=self.vel[1]
        self.size-=0.3
        self.life-=1
        return self.life>0

    def draw(self):
        if self.size>0:
            pygame.draw.circle(WIN,self.color,(int(self.x),int(self.y)),int(self.size))


###################################################
# BUBBLE OBJECT
###################################################
class Bubble:
    def __init__(self, good=True):
        self.good = good
        self.x = random.randint(60, WIDTH - 60)
        self.y = HEIGHT + 80
        self.r = 40
        self.speed = random.randint(-1,1), random.randint(-5,-2)
        self.spawn = time.time()

    def draw(self):
        if self.good and bubble_img:
            WIN.blit(bubble_img,(self.x-45,self.y-45))
        elif (not self.good) and bomb_img:
            WIN.blit(bomb_img,(self.x-45,self.y-45))
        else:
            pygame.draw.circle(WIN, BLUE if self.good else RED,(self.x,self.y),self.r)

    def move(self):
        vx, vy = self.speed
        self.x += vx
        self.y += vy

    def clicked(self,pos):
        px,py=pos
        return (self.x-px)**2 + (self.y-py)**2 <= self.r**2


###################################################
# GAME MAIN LOOP
###################################################
def main():
    score = 0
    lives = LIVES
    start = time.time()

    bubbles = []
    particles = []

    hit_count = 0
    click_count = 0
    reaction_times = []

    level = 1

    while True:
        clock.tick(60)

        if use_bg:
            WIN.blit(BG_IMAGE,(0,0))
        else:
            WIN.fill((210,235,255))

        elapsed = int(time.time()-start)
        remaining = TOTAL_TIME - elapsed

        # ---------- END GAME ----------
        if remaining <= 0 or lives <= 0:
            WIN.fill((210,235,255))
            WIN.blit(BIG.render("Game Over!",True,BLACK),(300,160))
            WIN.blit(BIG.render(f"Score: {score}",True,BLACK),(340,240))

            accuracy = round((hit_count/max(click_count,1))*100,2)
            avg_rt = round(sum(reaction_times)/max(len(reaction_times),1),3)

            WIN.blit(FONT.render(f"Accuracy: {accuracy}%",True,BLACK),(360,320))
            WIN.blit(FONT.render(f"Avg Reaction: {avg_rt}s",True,BLACK),(330,360))

            WIN.blit(FONT.render("Press R to Restart  |  ESC to Exit",True,BLACK),(260,450))
            pygame.display.update()

            keys = pygame.key.get_pressed()
            if keys[pygame.K_r]:
                return main()
            if keys[pygame.K_ESCAPE]:
                pygame.quit()
                sys.exit()
            continue

        # ---------- EVENTS ----------
        for event in pygame.event.get():
            if event.type==pygame.QUIT:
                pygame.quit()
                sys.exit()

            if event.type == pygame.MOUSEBUTTONDOWN:
                pos = pygame.mouse.get_pos()
                click_count += 1
                for b in bubbles[:]:
                    if b.clicked(pos):
                        rt = time.time() - b.spawn
                        reaction_times.append(rt)

                        if b.good:
                            score += 1
                            hit_count += 1
                            if POP: POP.play()
                            for i in range(15):
                                particles.append(Particle(b.x,b.y,BLUE))
                        else:
                            lives -=1
                            if BOOM: BOOM.play()
                            for i in range(15):
                                particles.append(Particle(b.x,b.y,RED))

                        bubbles.remove(b)

        # ---------- SPAWN ----------
        if random.randint(1,40-level)==1:
            bubbles.append(Bubble(True))
        if random.randint(1,95-level)==1:
            bubbles.append(Bubble(False))

        # ---------- MOVE ----------
        for b in bubbles[:]:
            b.move()
            if b.y < -70:
                bubbles.remove(b)
            else:
                b.draw()

        for p in particles[:]:
            if not p.update():
                particles.remove(p)
            else:
                p.draw()

        # ---------- UI ----------
        WIN.blit(FONT.render(f"Score: {score}",True,BLACK),(20,20))
        WIN.blit(FONT.render(f"Lives: {lives}",True,BLACK),(20,60))
        WIN.blit(FONT.render(f"Time: {remaining}",True,BLACK),(20,100))

        pygame.display.update()


if __name__ == "__main__":
    main()
