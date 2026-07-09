interface JobScoreProps {
  score: number | null;
}

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const bandClass = (score: number): string => {
  if (score >= 70) return "jobs-score--high";
  if (score >= 40) return "jobs-score--medium";
  return "jobs-score--low";
};

export const JobScore = ({ score }: JobScoreProps) => {
  if (score == null) {
    return (
      <svg className="jobs-score jobs-score--none" viewBox="0 0 44 44" role="img" aria-label="No AI match score">
        <circle className="jobs-score-track" cx="22" cy="22" r={RADIUS} />
      </svg>
    );
  }

  const pct = Math.max(0, Math.min(100, score)) / 100;
  const offset = CIRCUMFERENCE * (1 - pct);

  return (
    <svg
      className={`jobs-score ${bandClass(score)}`}
      viewBox="0 0 44 44"
      role="img"
      aria-label={`AI match score ${score} percent`}
    >
      <circle className="jobs-score-track" cx="22" cy="22" r={RADIUS} />
      <circle
        className="jobs-score-arc"
        cx="22"
        cy="22"
        r={RADIUS}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
      />
      <text className="jobs-score-text" x="22" y="22">
        {score}
      </text>
    </svg>
  );
};
