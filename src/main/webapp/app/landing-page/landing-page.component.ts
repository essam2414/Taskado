import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from 'app/layouts/header/header.component';
import { AccountService } from 'app/core/auth/account.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SharedModule from 'app/shared/shared.module';
import FooterComponent from 'app/layouts/footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { StateStorageService } from 'app/core/auth/state-storage.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'jhi-landing-page',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, HeaderComponent, SharedModule, FooterComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export default class LandingPageComponent implements AfterViewInit, OnInit {
  themes = ['Default', 'Midnight', 'Amethyst', 'Blush', 'Apricot', 'Mist'];

  @ViewChild('track') trackRef!: ElementRef;

  reviews = [
    {
      name: 'Emma Rackham',
      role: 'Paralegal',
      quote:
        'I suggested adding theme colours, and they made it happen! The dashboard looks amazing - really excited to use Taskado when it launches.',
    },
    {
      name: 'Alex Morgan',
      role: 'Designer',
      quote:
        'A beautifully designed and functional app! I love that I can switch to dark mode and tweak the font size — finally an app that thinks about visual comfort. It just fits my workflow perfectly.',
    },
    {
      name: 'Mina Ahmed',
      role: 'Researcher',
      quote:
        'I find Pomodoro timers really help me in my revision without burning out or getting distracted. I didn’t expect it to make such a difference.',
    },
    {
      name: 'Zaid Khan',
      role: 'Operations Assistant',
      quote:
        'I used to juggle between three different apps. With Taskado, everything I use daily is all in one place. It saves me hours every week.',
    },
    {
      name: 'Noah Evans',
      role: 'Freelancer',
      quote:
        'I can plan structured sprints or just jot quick notes when ideas hit — it works both ways. It’s rare to find something that is personalised to me.',
    },
    {
      name: 'Layla Mahmood',
      role: 'Parent',
      quote: 'Helps me set reminders for school runs and work. Really love the app it is so helpful!',
    },
  ];

  visibleReviews: any[] = [];
  currentIndex = 0;
  autoSlideInterval: any;

  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private accountService = inject(AccountService);
  private readonly stateStorageService = inject(StateStorageService);

  ngOnInit(): void {
    this.updateVisibleReviews();
  }

  ngAfterViewInit(): void {
    const sections = gsap.utils.toArray('.section');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) {
              window.dispatchEvent(new CustomEvent('sectionChange', { detail: id }));
            }
          }
        });
      },
      {
        rootMargin: '-50% 0px -40% 0px', // triggers near the middle
        threshold: 0.1,
      },
    );

    sections.forEach(section => {
      observer.observe(section as Element);
    });

    // animate header
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.landing-header');
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // animate each section
    sections.forEach((section, index) => {
      const el = section as HTMLElement;
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top center',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // animate hero section

    const heroTimeline = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 1 },
    });

    heroTimeline
      .from('.landing-title', { y: 30, opacity: 0 })
      .from('.landing-subtitle', { y: 20, opacity: 0 }, '-=0.6')
      .from('.landing-buttons', { y: 20, opacity: 0 }, '-=0.6')
      .from('.background-svg', { scale: 0.98, opacity: 0 }, '-=0.5')
      .from(
        '.floating-card',
        {
          y: 20,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
        },
        '-=0.3',
      );

    // animate feature cards
    const featureCards = gsap.utils.toArray('.feature-card');

    gsap.from(featureCards, {
      opacity: 0,
      y: 50,
      stagger: {
        each: 0.2,
        from: 'start',
      },
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '.feature-section',
        start: 'top center',
      },
    });

    // animate accessibility cards
    const a11yCards = gsap.utils.toArray('.a11y-card');

    gsap.from(a11yCards, {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.a11y-section',
        start: 'top center',
      },
    });

    // animate dashboard widgets
    const dashboardWidgets = gsap.utils.toArray('.widget');

    gsap.from(dashboardWidgets, {
      opacity: 0,
      y: 30,
      scale: 0.95,
      stagger: {
        each: 0.15,
        from: 'start',
      },
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.dashboard-preview',
        start: 'top center',
      },
    });

    // animate dashboard themes
    let themeIndex = 0;
    const themes = ['Default', 'Midnight', 'Blush', 'Apricot', 'Mist'];

    const front = document.querySelector('.dashboard-preview.front') as HTMLElement;
    const back = document.querySelector('.dashboard-preview.back') as HTMLElement;

    gsap.set(back, { opacity: 0 });

    const switchTheme = (): void => {
      themeIndex = (themeIndex + 1) % themes.length;
      const nextTheme = themes[themeIndex];

      back.setAttribute('data-dashboard-theme', nextTheme);

      const tl = gsap.timeline({
        defaults: { duration: 1.2, ease: 'power3.inOut' },
      });

      tl.set(back, { opacity: 0 })
        .to(back, { opacity: 1 }, 0)
        .to(front, { opacity: 0 }, 0)
        .add(() => {
          front.setAttribute('data-dashboard-theme', nextTheme);
          gsap.set(front, { opacity: 1 });
          gsap.set(back, { opacity: 0 });
        });
    };

    ScrollTrigger.create({
      trigger: '.dashboard-section',
      start: 'top center',
      onEnter() {
        setInterval(switchTheme, 2000);
      },
      once: true,
    });

    // animate reviews
    this.startAutoSlide();

    // Animate CTA section
    const ctaTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top center',
      },
      defaults: { ease: 'power2.out', duration: 1 },
    });

    ctaTimeline
      .from('.cta-header', { opacity: 0, y: 30 })
      .from('.middle', { opacity: 0, y: 20 }, '-=0.6')
      .from('.badge', { opacity: 0, x: -30, stagger: 0.2 }, '-=0.4');
  }

  updateVisibleReviews(): void {
    const isMobile = window.innerWidth <= 768;
    const total = this.reviews.length;
    const curr = this.currentIndex % total;

    if (isMobile) {
      this.visibleReviews = [this.reviews[curr]];
    } else {
      const prev = (this.currentIndex - 1 + total) % total;
      const next = (this.currentIndex + 1) % total;
      this.visibleReviews = [this.reviews[prev], this.reviews[curr], this.reviews[next]];
    }
  }

  swipe(direction: 'left' | 'right'): void {
    const trackEl = this.trackRef.nativeElement as HTMLElement;
    const cardWidth = trackEl.offsetWidth / 3;
    const offset = direction === 'right' ? -cardWidth : cardWidth;

    // Update current index FIRST
    this.currentIndex =
      direction === 'right'
        ? (this.currentIndex + 1) % this.reviews.length
        : (this.currentIndex - 1 + this.reviews.length) % this.reviews.length;

    // Update visible reviews BEFORE animating so the DOM has the next review ready
    this.updateVisibleReviews();

    // Animate track
    gsap.fromTo(
      trackEl,
      { x: -offset }, // Start with offset
      {
        x: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
    );

    this.resetAutoSlide();
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.swipe('right');
    }, 4000);
  }

  resetAutoSlide(): void {
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }

  getAvatarUrl(review: { name: string }): string {
    const seed = review.name.trim();
    const backgroundColors = [
      '7FB3D5',
      'A569BD',
      'F7DC6F',
      'F1948A',
      '73C6B6',
      'F0B27A',
      '85C1E9',
      'BB8FCE',
      'F8C471',
      '82E0AA',
      'F5B7B1',
      'FAD7A0',
      'A3E4D7',
      'D7BDE2',
      'AED6F1',
      'F9E79F',
    ];

    // Generate simple numeric seed from char codes (no bitwise)
    let total = 0;
    for (let i = 0; i < seed.length; i++) {
      total += seed.charCodeAt(i);
    }

    const index = total % backgroundColors.length;
    const bgColor = backgroundColors[index];

    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&radius=50&fontSize=38&backgroundColor=${bgColor}`;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  continueAsGuest(): void {
    this.http.post<{ id_token: string }>('/api/account/guest', {}).subscribe({
      next: response => {
        const token = response.id_token;
        if (token) {
          this.accountService.authenticate(null); // clear current user first
          this.stateStorageService.storeAuthenticationToken(token, false); // ✅ Use correct key via service
          this.accountService.identity(true).subscribe(() => {
            this.router.navigate(['/dashboard']);
          });
        }
      },
      error: () => alert('Could not create guest account. Please try again.'),
    });
  }
}
