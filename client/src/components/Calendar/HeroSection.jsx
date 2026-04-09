import { MONTH_NAMES, MONTH_HERO_IMAGES, MONTH_TAGS } from "./constants";

export default function HeroSection({ currentDate, slideDirection, animating }) {
  const month = currentDate.getMonth();
  const year  = currentDate.getFullYear();
  const hero  = MONTH_HERO_IMAGES[month];
  const tags  = MONTH_TAGS[month] || [];

  const monthNumber = String(month + 1).padStart(2, "0");

  const animClass = animating
    ? slideDirection === "left" ? "animate-slide-out-left" : "animate-slide-out-right"
    : slideDirection === "left"
    ? "animate-slide-in-left"
    : slideDirection === "right"
    ? "animate-slide-in-right"
    : "";

  return (
    <section
      id="hero-section"
      className={`relative h-[100px] md:h-[130px] xl:h-[160px] w-full rounded-xl overflow-hidden ${animClass}`}
    >
      {hero.url ? (
        <div
          className="absolute inset-0 bg-cover bg-center parallax-bg scale-110 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url('${hero.url}')` }}
          role="img"
          aria-label={hero.alt}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${hero.gradient} transition-all duration-700`}
          role="img"
          aria-label={hero.alt}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "150px 150px",
            }}
          />
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/20 backdrop-blur-sm rounded text-white/60 text-[10px] font-mono tracking-widest uppercase select-none">
            placeholder · {hero.label}
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

      <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 text-white drop-shadow-lg">
        <h1 className="text-3xl md:text-4xl xl:text-5xl leading-none font-black tracking-tighter opacity-90">
          {monthNumber}
        </h1>
        <p className="text-sm md:text-base xl:text-lg font-light tracking-widest uppercase opacity-80">
          {MONTH_NAMES[month]} <span className="opacity-60">{year}</span>
        </p>
      </div>

      <div className="absolute top-3 right-3 md:top-5 md:right-5 flex flex-wrap justify-end gap-1.5 md:gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="px-2.5 py-1 md:px-3.5 md:py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white border border-white/30 text-[10px] md:text-xs font-semibold shadow-md tracking-wide transition-all duration-300 hover:bg-black/65"
          >
            {tag}
          </div>
        ))}
      </div>
    </section>
  );
}
