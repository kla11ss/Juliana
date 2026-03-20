import Image from "next/image";
import Link from "next/link";

import { ConsultationForm } from "@/components/consultation-form";

export default function HomePage() {
  const principles = [
    {
      title: "Работать",
      text: "Не ждать мотивации по настроению, а выстраивать действие, которое держит форму и даёт результат."
    },
    {
      title: "Держать ритм",
      text: "Не распыляться на хаос. Выбирать дисциплину, систему и уважение к собственному телу."
    },
    {
      title: "Побеждать",
      text: "Не играть в лёгкий путь. Сильная форма и внутренняя уверенность собираются через работу."
    }
  ];

  const faqItems = [
    {
      question: "Кому подойдёт персональный менторинг?",
      answer:
        "Тем, кому нужен личный формат работы: не общий поток, а точный взгляд на цель, текущую точку и путь к результату."
    },
    {
      question: "Можно ли сначала прийти на консультацию?",
      answer:
        "Да. Если вы хотите сначала разобрать конкретный вопрос и понять, подходит ли вам дальнейшая работа, консультация — корректная точка входа."
    },
    {
      question: "Нужно ли уже быть в идеальной форме?",
      answer:
        "Нет. Важнее готовность работать, держать ритм и честно включаться в процесс."
    },
    {
      question: "Как быстро приходит ответ после заявки?",
      answer:
        "Заявка приходит команде сразу. После внутреннего просмотра вы получаете обратную связь лично."
    }
  ];

  return (
    <main className="site-shell">
      <header className="topbar" data-reveal>
        <Link className="brand-mark" href="/">
          <span>Ulyana</span>
          <strong>Goykhman</strong>
        </Link>

        <nav className="topnav" aria-label="Основная навигация">
          <a href="#philosophy">Философия</a>
          <a href="#formats">Форматы</a>
          <a href="#faq">FAQ</a>
        </nav>

        <Link className="button button--ghost button--compact" href="/apply">
          Подать заявку
        </Link>
      </header>

      <section className="hero-composition" data-reveal>
        <div className="hero-backword">РАБОТАТЬ</div>

        <div className="hero-stage">
          <div className="hero-content">
            <p className="section-tag">Персональный менторинг / women worldwide / ru</p>
            <h1 className="hero-headline">
              Работать.
              <br />
              Держать
              <br />
              форму.
              <br />
              Побеждать.
            </h1>
            <p className="hero-description">
              Для женщин, которым нужен не поток мотивации, а личная работа: дисциплина, сильная
              форма, точный вектор и высокий стандарт к себе.
            </p>

            <div className="hero-cta">
              <Link className="button button--primary" href="/apply">
                Подать заявку на менторинг
              </Link>
              <a className="button button--consultation" href="#consultation">
                Хочу консультацию · 20 000 ₽
              </a>
            </div>

            <div className="hero-track" aria-label="Философия проекта">
              <span>работать</span>
              <span>держать ритм</span>
              <span>побеждать</span>
            </div>

            <div className="hero-microgrid">
              <div className="micro-card micro-card--text">
                <span>Почему так жёстко</span>
                <p>Потому что форма не собирается из настроения. Она собирается из повторения.</p>
              </div>

              <div className="micro-card micro-card--media">
                <div className="micro-card__thumb">
                  <Image
                    alt="Ульяна Гойхман на сцене"
                    fill
                    sizes="220px"
                    src="/images/ulyana-stage.png"
                  />
                </div>
                <div className="micro-card__copy">
                  <span>Эстетика проекта</span>
                  <p>Собранность, сила, высокая личная планка.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-figure-wrap">
            <div className="hero-figure-glow" />
            <div className="hero-portrait-card">
              <Image
                alt="Портрет Ульяны Гойхман"
                fill
                sizes="(max-width: 820px) 44vw, 260px"
                src="/images/ulyana-hero.png"
              />
            </div>
            <img alt="" aria-hidden="true" className="hero-cutout" src="/images/ulyana-cutout.svg" />
            <div className="hero-figure-note">
              <span>Личный формат</span>
              <strong>Менторинг и консультация</strong>
              <p>Один аккуратный вход: заявка, вопрос, стоимость и контакт фиксируются сразу.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="manifesto-panel" data-reveal id="philosophy">
        <div className="manifesto-copy">
          <p className="section-tag section-tag--dark">Философия</p>
          <h2 className="section-title section-title--dark">«Работать» здесь не декоративный лозунг.</h2>
          <p className="manifesto-text">
            В основе одно слово: работать. Не ждать идеального понедельника. Не искать волшебный
            протокол. Не перекладывать ответственность на настроение. Работать, держать ритм и
            через это выигрывать у собственной инерции.
          </p>
        </div>

        <div className="principles-grid">
          {principles.map((item) => (
            <article key={item.title} className="principle-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="formats-stage" data-reveal id="formats">
        <article className="mentoring-panel">
          <div className="mentoring-panel__copy">
            <p className="section-tag">Основной формат</p>
            <h2 className="section-title">
              Персональный
              <br />
              менторинг
            </h2>
            <p className="mentoring-panel__text">
              Формат для тех, кто готов идти глубже одной консультации: с ясной точкой А, реальными
              ограничениями, личным разбором и маршрутом, который не разваливается через неделю.
            </p>

            <ul className="offer-list">
              <li>Пошаговая заявка вместо хаотичного входа.</li>
              <li>Отдельный вопрос Ульяне внутри анкеты.</li>
              <li>Фокус на результате, а не на визуальном шуме.</li>
            </ul>

            <Link className="button button--primary" href="/apply">
              Подать заявку
            </Link>
          </div>

          <div className="mentoring-panel__visual">
            <div className="mentoring-panel__word">ФОРМА</div>
          </div>
        </article>

        <article className="consult-card" id="consultation">
          <div className="consult-card__head">
            <p className="section-tag section-tag--dark">Отдельный формат</p>
            <h2 className="section-title section-title--dark">Консультация</h2>
            <div className="consult-price">
              <span>20 000 ₽</span>
              <p>Разовый точный разбор, если сначала нужен один сильный разговор по конкретному запросу.</p>
            </div>
          </div>

          <div className="consult-card__intro">
            <strong>Кнопка «Хочу консультацию» ведёт в отдельный сценарий, а не смешивается с менторингом.</strong>
            <p>
              Вы сразу видите стоимость, оставляете контакт и заранее описываете вопрос. Ничего не
              теряется и не уходит в хаотичную переписку.
            </p>
          </div>

          <ConsultationForm />
        </article>
      </section>

      <section className="editorial-stage" data-reveal>
        <div className="editorial-stage__visual">
          <div className="editorial-stage__frame">
            <Image
              alt="Ульяна Гойхман на сцене"
              className="editorial-stage__image"
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
              src="/images/ulyana-stage.png"
            />
          </div>
        </div>

        <div className="editorial-stage__copy">
          <p className="section-tag">Визуальный нерв</p>
          <h2 className="section-title">
            Не потоковый
            <br />
            фитнес-шаблон.
            <br />
            А собранный,
            <br />
            статусный тон.
          </h2>
          <p>
            Здесь важны редкость, собранность и характер. Не витрина с банальными обещаниями, а
            личный бренд с визуальным нервом: крупная типографика, жёсткая композиция, драматичный
            контраст и уважение к образу.
          </p>

          <div className="editorial-points">
            <span>чёрный фон и светлое поле</span>
            <span>бордовые и синие акценты</span>
            <span>крупный силуэт на первом экране</span>
          </div>
        </div>
      </section>

      <section className="faq-stage" data-reveal id="faq">
        <div className="faq-stage__heading">
          <p className="section-tag section-tag--dark">FAQ</p>
          <h2 className="section-title section-title--dark">Коротко о главном перед подачей заявки.</h2>
        </div>

        <div className="faq-stage__list">
          {faqItems.map((item) => (
            <details key={item.question} className="faq-row">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="closing-stage" data-reveal>
        <div className="closing-stage__copy">
          <p className="section-tag">Следующий шаг</p>
          <h2 className="section-title">
            Если вам близка философия
            <br />
            «работать, чтобы побеждать»,
            <br />
            начните с заявки.
          </h2>
        </div>

        <div className="closing-stage__actions">
          <Link className="button button--primary" href="/apply">
            Подать заявку на менторинг
          </Link>
          <a className="button button--consultation" href="#consultation">
            Хочу консультацию · 20 000 ₽
          </a>
        </div>
      </section>

      <footer className="site-footer" data-reveal>
        <div className="site-footer__brand">
          <Link className="brand-mark brand-mark--footer" href="/">
            <span>Ulyana</span>
            <strong>Goykhman</strong>
          </Link>
          <p className="site-footer__statement">
            Работать. Держать форму. Побеждать. Персональный менторинг и консультация в одном
            аккуратном digital-пространстве.
          </p>
        </div>

        <nav aria-label="Навигация в подвале" className="site-footer__nav">
          <a href="#philosophy">Философия</a>
          <a href="#formats">Форматы</a>
          <a href="#consultation">Консультация</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="site-footer__meta">
          <div className="site-footer__legal">
            <Link href="/privacy">Политика конфиденциальности</Link>
            <Link href="/consent">Согласие на обработку данных</Link>
          </div>
          <p className="site-footer__note">
            Заявка на менторинг и запрос на консультацию отправляются через форму на сайте.
          </p>
          <p className="site-footer__copy">© {new Date().getFullYear()} Ulyana Goykhman</p>
        </div>
      </footer>
    </main>
  );
}
