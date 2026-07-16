const answerForm = document.querySelector("#answer-form");
const result = document.querySelector("#result");
const resultKicker = document.querySelector("#result-kicker");
const resultCopy = document.querySelector("#result-copy");
const hintButton = document.querySelector("#hint-button");
const hintList = document.querySelector("#hint-list");
const hintCount = document.querySelector("#hint-count");
const solutionButton = document.querySelector("#solution-button");
const solutionBody = document.querySelector("#solution-body");
const shareButton = document.querySelector("#share-button");
const toast = document.querySelector("#toast");

const responses = {
  1: "Door 1 gives exactly two true plaques, but its own plaque is one of them.",
  2: "Door 2 also gives exactly two true plaques, but plaque 2 is true.",
  3: "Door 3 makes plaques 1, 2, and 5 true. That is one truth too many.",
  4: "Door 4 makes plaques 2, 3, and 4 true. It fails both constraints.",
  5: "Only plaques 1 and 2 remain true, while door 5's own plaque is false. You live."
};

const hints = [
  "Ignore the story for a moment. Assume each door is safe in turn and count the true plaques.",
  "Doors 3 and 4 can be eliminated because each produces three true plaques.",
  "Doors 1, 2, and 5 each produce exactly two truths. Now inspect each candidate's own plaque."
];

let hintsShown = 0;
let toastTimer;

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(answerForm);
  const selected = Number(data.get("door"));

  result.hidden = false;
  result.classList.toggle("correct", selected === 5);

  if (!selected) {
    resultKicker.textContent = "No door chosen";
    resultCopy.textContent = "Commit to an answer before testing it.";
    result.classList.remove("correct");
    return;
  }

  resultKicker.textContent = selected === 5 ? "The hinges exhale" : `Door ${selected} is unsafe`;
  resultCopy.textContent = responses[selected];
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

hintButton.addEventListener("click", () => {
  if (hintsShown >= hints.length) return;

  const item = document.createElement("li");
  item.textContent = hints[hintsShown];
  hintList.append(item);
  hintsShown += 1;
  hintCount.textContent = `${hintsShown} / ${hints.length} hints used`;

  if (hintsShown === hints.length) {
    hintButton.textContent = "all hints revealed";
    hintButton.disabled = true;
  } else {
    hintButton.textContent = "take another hint";
  }
});

solutionButton.addEventListener("click", () => {
  const willOpen = solutionBody.hidden;
  solutionBody.hidden = !willOpen;
  solutionButton.setAttribute("aria-expanded", String(willOpen));
  solutionButton.textContent = willOpen ? "hide reasoning" : "reveal reasoning";
  if (willOpen) solutionBody.scrollIntoView({ behavior: "smooth", block: "start" });
});

shareButton.addEventListener("click", async () => {
  const url = `${window.location.origin}${window.location.pathname}#puzzle`;
  const shareData = { title: "Five Doors — Understory", text: "Try this logic puzzle without spoiling yourself.", url };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(url);
    showToast("link copied");
  } catch (error) {
    if (error.name !== "AbortError") showToast("copy failed");
  }
});

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 1800);
}
