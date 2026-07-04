// The journey slide's route register: four stations on one straight drawn
// trail. Each step hangs beneath its blaze, numbered like a field-guide
// itinerary. The scattered curve-sampling version read poorly at stage
// distance — this keeps the trail-map language (dashed line, diamond blazes)
// but ranks the steps evenly so every title survives the back row.

export function TrailSteps({
  steps,
}: {
  steps: readonly { title: string; copy: string }[];
}) {
  return (
    <ol className="pitch-trailsteps">
      {steps.map((step, i) => (
        <li key={step.title} className="pitch-trailsteps__step">
          <span className="pitch-trailsteps__marker" aria-hidden="true">
            <i className="pitch-trailsteps__blaze" />
          </span>
          <span className="pitch-trailsteps__index">
            {String(i + 1).padStart(2, "0")}
          </span>
          <strong>{step.title}</strong>
          <span className="pitch-trailsteps__copy">{step.copy}</span>
        </li>
      ))}
    </ol>
  );
}
