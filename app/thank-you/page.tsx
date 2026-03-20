import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="simple-page">
      <div className="simple-page__card">
        <p className="section-kicker">Спасибо</p>
        <h1>Заявка отправлена.</h1>
        <p>
          Мы получили ваш запрос и сохранили все детали. Команда свяжется с вами после внутреннего
          просмотра заявки.
        </p>
        <div className="simple-page__actions">
          <Link className="button button--primary" href="/">
            Вернуться на главную
          </Link>
          <Link className="button button--ghost" href="/apply">
            Отправить другую заявку
          </Link>
        </div>
      </div>
    </main>
  );
}
