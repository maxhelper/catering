document.addEventListener("DOMContentLoaded", async () => {
  const eventsWrapper = document.querySelector(".swiper-wrapper.events");
  const storiesWrapper = document.querySelector(".swiper-wrapper.stories");
  
  const templateEventSlide = document.querySelector(".swiper-slide.events");
  const templateStorySlide = document.querySelector(".swiper-slide.story-slide");
  const innerSlideTemplate = templateStorySlide.querySelector(".swiper-slide.inner-slide");

  // Удаляем шаблонные слайды
  templateEventSlide.remove();
  templateStorySlide.remove();

  try {
    const response = await fetch("/admin/events.json");
    const data = await response.json();

    Object.entries(data).forEach(([id, item], index) => {
      const eventId = String(index + 1);
      const firstPhoto = item.photos?.[0];
      if (!firstPhoto) return;

      const firstPhotoUrl = `/admin/${firstPhoto}`;

      // ----- EVENTS SLIDE -----
      const eventSlide = templateEventSlide.cloneNode(true);
      eventSlide.style.backgroundImage = `url('${firstPhotoUrl}')`;

      eventSlide.querySelector("#quantity").textContent = item.quantity || "";
      eventSlide.querySelector("#uppertext").textContent = item.upper || "";
      eventSlide.querySelector("#lowertext").textContent = item.lower || "";

      const outDiv = eventSlide.querySelector("#id-out");
      outDiv.textContent = eventId;
      outDiv.setAttribute("eventid-out", eventId);

      eventsWrapper.appendChild(eventSlide);

      // ----- STORY SLIDE -----
      const storySlide = templateStorySlide.cloneNode(true);

      const inDiv = storySlide.querySelector("#id-in");
      inDiv.textContent = eventId;
      inDiv.setAttribute("eventid-in", eventId);

      // Обновляем внутреннее содержимое story slide
      storySlide.querySelector("#quantity").textContent = item.quantity || "";
      storySlide.querySelector("#uppertext").textContent = item.upper || "";
      storySlide.querySelector("#lowertext").textContent = item.lower || "";

      const innerSwiperWrapper = storySlide.querySelector(".inner-swiper .swiper-wrapper");
      innerSwiperWrapper.innerHTML = "";

      item.photos.forEach((photo) => {
        const innerSlide = innerSlideTemplate.cloneNode(true);
        const photoUrl = `/admin/${photo}`;
        innerSlide.style.backgroundImage = `url('${photoUrl}')`;
        innerSwiperWrapper.appendChild(innerSlide);
      });

      storiesWrapper.appendChild(storySlide);
    });

    document.dispatchEvent(new Event("cardsReady"));
  } catch (err) {
    console.error("Ошибка загрузки данных:", err);
  }
});
