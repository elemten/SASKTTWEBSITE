import React from "react";
import projectData from "../../../portfolio.project.json";

const styles = {
  page: {
    background: "#ffffff",
    color: "#121212",
    fontFamily: '"Source Sans 3", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    lineHeight: 1.6,
  },
  container: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "40px 20px 72px",
  },
  section: {
    marginTop: 28,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: 600,
    margin: "0 0 8px",
  },
  heroMeta: {
    fontSize: 14,
    color: "#444",
    margin: "0 0 12px",
  },
  oneLiner: {
    fontSize: 16,
    margin: "0 0 12px",
    maxWidth: 720,
  },
  linkRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    fontSize: 14,
  },
  link: {
    color: "#121212",
    textDecoration: "none",
    borderBottom: "1px solid transparent",
  },
  hr: {
    border: "none",
    borderTop: "1px solid #e5e5e5",
    margin: "24px 0",
  },
  sectionTitle: {
    fontSize: 20,
    margin: "0 0 12px",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  },
  statCard: {
    border: "1px solid #e6e6e6",
    borderRadius: 10,
    padding: 12,
    background: "#fafafa",
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#666",
  },
  statValue: {
    fontSize: 18,
    fontWeight: 600,
    marginTop: 6,
  },
  bullets: {
    margin: 0,
    paddingLeft: 18,
  },
  architectureRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
    marginBottom: 16,
  },
  archBlock: {
    border: "1px solid #e6e6e6",
    borderRadius: 10,
    padding: 12,
    background: "#ffffff",
  },
  archLabel: {
    fontSize: 13,
    fontWeight: 600,
  },
  archArrow: {
    textAlign: "center",
    fontSize: 18,
    color: "#999",
  },
  screenshotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  screenshotCard: {
    border: "1px solid #e6e6e6",
    borderRadius: 10,
    overflow: "hidden",
    background: "#fafafa",
  },
  screenshotImg: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  caption: {
    fontSize: 12,
    color: "#555",
    padding: "8px 10px",
  },
  callout: {
    borderLeft: "3px solid #1a1a1a",
    background: "#f7f7f7",
    padding: "10px 12px",
    fontSize: 14,
    marginTop: 12,
  },
  evidenceList: {
    margin: 0,
    paddingLeft: 0,
    listStyle: "none",
    display: "grid",
    gap: 8,
  },
  filePath: {
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: 13,
  },
  stackGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  },
  stackGroup: {
    border: "1px solid #e6e6e6",
    borderRadius: 10,
    padding: 12,
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTop: "1px solid #e5e5e5",
  },
  contactRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    fontSize: 14,
  },
};

const PLACEHOLDER_CONTACT = {
  name: "Your Name",
  email: "you@example.com",
  linkedin: "linkedin.com/in/yourhandle",
  github: "github.com/yourhandle",
};

function safeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function formatDateRange(dates) {
  if (!dates || (!dates.start && !dates.end)) return "Dates not provided";
  return `${dates.start || "Unknown"} to ${dates.end || "Present"}`;
}

function resolveAssetPath(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("public/")) return `/${path.replace(/^public\//, "")}`;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

export default function PortfolioCaseStudy() {
  let project = null;

  try {
    project = projectData && projectData.project ? projectData.project : null;
  } catch (error) {
    project = null;
  }

  const title = safeString(project?.title, "Project Title");
  const role = safeString(project?.role, "Role not specified");
  const status = safeString(project?.status, "Status unknown");
  const dates = project?.dates || { start: null, end: null };
  const oneLiner = safeString(project?.one_liner, "One-line summary not provided.");
  const links = project?.links || {};

  const impactMetrics = toArray(project?.impact?.metrics);
  const impactQual = toArray(project?.impact?.qualitative);
  const problem = toArray(project?.problem);
  const solution = toArray(project?.solution);

  const architecture = project?.architecture || {};
  const architectureOverview = safeString(architecture?.overview, "");
  const architectureComponents = toArray(architecture?.components);
  const architectureFlow = toArray(architecture?.data_flow);

  const security = toArray(project?.security_reliability?.security);
  const reliability = toArray(project?.security_reliability?.reliability);

  const keyFiles = toArray(project?.evidence?.key_files);
  const screenshots = toArray(project?.evidence?.screenshots);

  const stack = project?.tech_stack || {};
  const stackGroups = [
    { label: "Frontend", items: toArray(stack.frontend) },
    { label: "Backend", items: toArray(stack.backend) },
    { label: "Database", items: toArray(stack.database) },
    { label: "Infra", items: toArray(stack.infra) },
    { label: "Tooling", items: toArray(stack.tooling) },
  ];

  const hasMetrics = impactMetrics.length > 0;
  const impactBullets = impactQual.length
    ? impactQual.slice(0, 3)
    : ["Impact details not provided."];

  const screenshotsResolved = screenshots.map((shot) => ({
    path: resolveAssetPath(shot?.path),
    caption: safeString(shot?.caption, ""),
  }));

  const hasScreenshots = screenshotsResolved.some((shot) => shot.path);
  const screenshotLabel = hasScreenshots ? "Brand assets" : "Screenshots missing";

  const recommendedShots = [
    "Admin dashboard overview",
    "Membership registration form",
    "Finance or invoicing screen",
  ];

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <section>
          <h1 style={styles.heroTitle}>{title}</h1>
          <p style={styles.heroMeta}>
            {role} • {formatDateRange(dates)} • {status.toLowerCase()}
          </p>
          <p style={styles.oneLiner}>{oneLiner}</p>
          <div style={styles.linkRow}>
            {links.demo_url && (
              <a style={styles.link} href={links.demo_url} target="_blank" rel="noreferrer">
                Demo
              </a>
            )}
            {links.repo_url && (
              <a style={styles.link} href={links.repo_url} target="_blank" rel="noreferrer">
                Repo
              </a>
            )}
            {links.docs_url && (
              <a style={styles.link} href={links.docs_url} target="_blank" rel="noreferrer">
                Docs
              </a>
            )}
            {!links.demo_url && !links.repo_url && !links.docs_url && (
              <span>Links available on request.</span>
            )}
          </div>
        </section>

        <hr style={styles.hr} />

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Impact</h2>
          {hasMetrics ? (
            <div style={styles.statGrid}>
              {impactMetrics.slice(0, 4).map((metric, index) => {
                const value =
                  metric?.value !== null && metric?.value !== undefined
                    ? `${metric.value}${metric?.unit ? ` ${metric.unit}` : ""}`
                    : "Value not provided";
                return (
                  <div style={styles.statCard} key={`metric-${index}`}>
                    <div style={styles.statLabel}>
                      {safeString(metric?.label, "Metric")}
                    </div>
                    <div style={styles.statValue}>{value}</div>
                  </div>
                );
              })}
            </div>
          ) : null}
          <ul style={styles.bullets}>
            {impactBullets.map((item, index) => (
              <li key={`impact-${index}`}>{item}</li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>What I Built</h2>
          <ul style={styles.bullets}>
            {solution.length
              ? solution.slice(0, 7).map((item, index) => (
                  <li key={`solution-${index}`}>{item}</li>
                ))
              : problem.slice(0, 7).map((item, index) => (
                  <li key={`problem-${index}`}>{item}</li>
                ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Architecture</h2>
          <div style={styles.architectureRow}>
            <div style={styles.archBlock}>
              <div style={styles.archLabel}>Frontend</div>
              <div>React SPA (Vite)</div>
            </div>
            <div style={styles.archArrow}>→</div>
            <div style={styles.archBlock}>
              <div style={styles.archLabel}>Supabase</div>
              <div>Auth + Postgres + RLS</div>
            </div>
            <div style={styles.archArrow}>→</div>
            <div style={styles.archBlock}>
              <div style={styles.archLabel}>Edge Functions</div>
              <div>Invoices, payments, calendar sync</div>
            </div>
            <div style={styles.archArrow}>→</div>
            <div style={styles.archBlock}>
              <div style={styles.archLabel}>External APIs</div>
              <div>Stripe, Google Calendar</div>
            </div>
          </div>
          {architectureOverview && <p>{architectureOverview}</p>}
          {architectureComponents.length > 0 && (
            <>
              <h3>Components</h3>
              <ul style={styles.bullets}>
                {architectureComponents.map((item, index) => (
                  <li key={`component-${index}`}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {architectureFlow.length > 0 && (
            <>
              <h3>Data flow</h3>
              <ul style={styles.bullets}>
                {architectureFlow.map((item, index) => (
                  <li key={`flow-${index}`}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Security and Reliability</h2>
          <ul style={styles.bullets}>
            {[...security, ...reliability].slice(0, 8).map((item, index) => (
              <li key={`sec-${index}`}>{item}</li>
            ))}
            {[...security, ...reliability].length === 0 && (
              <li>Security and reliability details not provided.</li>
            )}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Screenshots</h2>
          {hasScreenshots ? (
            <>
              <div style={styles.screenshotGrid}>
                {screenshotsResolved.slice(0, 6).map((shot, index) => (
                  <figure style={styles.screenshotCard} key={`shot-${index}`}>
                    {shot.path && (
                      <img
                        style={styles.screenshotImg}
                        src={shot.path}
                        alt={shot.caption || "Screenshot"}
                      />
                    )}
                    <figcaption style={styles.caption}>
                      {shot.caption || screenshotLabel}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div style={styles.callout}>
                Add admin dashboard screenshots for stronger proof.
              </div>
            </>
          ) : (
            <>
              <div style={styles.callout}>{screenshotLabel}.</div>
              <ul style={styles.bullets}>
                {recommendedShots.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Evidence</h2>
          {keyFiles.length ? (
            <ul style={styles.evidenceList}>
              {keyFiles.slice(0, 8).map((file, index) => (
                <li key={`file-${index}`}>
                  <span style={styles.filePath}>{safeString(file?.path)}</span>
                  {file?.why ? ` — ${file.why}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p>No key files listed.</p>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Tech Stack</h2>
          <div style={styles.stackGrid}>
            {stackGroups.map((group) => (
              <div style={styles.stackGroup} key={group.label}>
                <strong>{group.label}</strong>
                <ul style={styles.bullets}>
                  {group.items.length ? (
                    group.items.map((item) => <li key={item}>{item}</li>)
                  ) : (
                    <li>Not listed.</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.footer}>
          <h2 style={styles.sectionTitle}>Contact</h2>
          <div style={styles.contactRow}>
            <span>{PLACEHOLDER_CONTACT.name}</span>
            <a style={styles.link} href={`mailto:${PLACEHOLDER_CONTACT.email}`}>
              {PLACEHOLDER_CONTACT.email}
            </a>
            <a
              style={styles.link}
              href={`https://${PLACEHOLDER_CONTACT.linkedin}`}
              target="_blank"
              rel="noreferrer"
            >
              {PLACEHOLDER_CONTACT.linkedin}
            </a>
            <a
              style={styles.link}
              href={`https://${PLACEHOLDER_CONTACT.github}`}
              target="_blank"
              rel="noreferrer"
            >
              {PLACEHOLDER_CONTACT.github}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
