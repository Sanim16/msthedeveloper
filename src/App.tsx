import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Cloud,
  Code2,
  Database,
  GitBranch,
  Layers3,
  Menu,
  ServerCog,
  ShieldCheck,
  Terminal,
  X,
  Moon,
  Sun,
  Zap,
} from 'lucide-react'
import { SiGithub } from 'react-icons/si'

const githubUrl = 'https://github.com/Sanim16/'
const linkedinUrl = 'https://www.linkedin.com/in/momohsanimusa'

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark'

    const saved = window.localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

type CaseStudyProps = {
  number: string
  title: string
  subtitle: string
  summary: string
  tags: string[]
  metrics: { value: string; label: string }[]
  architecture: ReactNode
  href: string
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function CaseStudy({
  number,
  title,
  subtitle,
  summary,
  tags,
  metrics,
  architecture,
  href,
}: CaseStudyProps) {
  return (
    <article className="case-study">
      <div className="case-copy">
        <div className="eyebrow">{number} / SELECTED WORK</div>
        <h3>{title}</h3>
        <p className="case-subtitle">{subtitle}</p>
        <p>{summary}</p>

        <div className="tag-row">
          {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </div>

        <div className="case-metrics">
          {metrics.map((metric) => (
            <Metric key={`${metric.value}-${metric.label}`} {...metric} />
          ))}
        </div>

        <a className="text-link" href={href}>
          Read case study <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="architecture-card">
        <div className="architecture-head">
          <span>Architecture</span>
          <span className="live-dot"><i /> production pattern</span>
        </div>
        {architecture}
      </div>
    </article>
  )
}

function KarpenterDiagram() {
  return (
    <div className="diagram">
      <div className="diagram-node primary">
        <ServerCog size={18} />
        <span>Amazon EKS</span>
      </div>
      <div className="connector vertical" />
      <div className="diagram-node">
        <Zap size={18} />
        <span>Karpenter</span>
      </div>
      <div className="connector vertical" />
      <div className="diagram-split">
        <div className="diagram-node small">
          <Layers3 size={16} />
          <span>NodePool</span>
        </div>
        <div className="diagram-node small">
          <Cloud size={16} />
          <span>EC2NodeClass</span>
        </div>
      </div>
      <div className="connector vertical" />
      <div className="diagram-node accent">
        <Cloud size={18} />
        <span>ARM64 EC2 capacity</span>
      </div>
      <div className="connector vertical" />
      <div className="pod-row">
        <span>workload</span>
        <span>workload</span>
        <span>workload</span>
      </div>
    </div>
  )
}

function GitOpsDiagram() {
  return (
    <div className="diagram">
      <div className="flow-row">
        <div className="diagram-node small"><SiGithub size={16} /><span>GitHub</span></div>
        <ArrowDownRight className="flow-arrow" size={18} />
        <div className="diagram-node small"><Terminal size={16} /><span>Actions</span></div>
        <ArrowDownRight className="flow-arrow" size={18} />
        <div className="diagram-node small"><Database size={16} /><span>ECR</span></div>
      </div>
      <div className="connector vertical" />
      <div className="diagram-node accent">
        <GitBranch size={18} />
        <span>GitOps repository</span>
      </div>
      <div className="connector vertical" />
      <div className="diagram-node">
        <Layers3 size={18} />
        <span>Argo CD</span>
      </div>
      <div className="connector vertical" />
      <div className="env-row">
        <div><b>DEV</b><span>auto sync</span></div>
        <div><b>STG</b><span>auto sync</span></div>
        <div><b>PROD</b><span>manual sync</span></div>
      </div>
    </div>
  )
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className="nav-wrap">
        <nav className="nav container">
          <a className="brand" href="#top" onClick={closeMenu}>
            MOMOH SANI MUSA
          </a>

          <button
            className="menu-button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#work" onClick={closeMenu}>Work</a>
            <a href="#experience" onClick={closeMenu}>Experience</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#stack" onClick={closeMenu}>Stack</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </div>

          <div className="nav-social">
            <ThemeToggle />
            <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><SiGithub size={17} /></a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.38 4.28 5.48v6.26zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM3.56 9h3.56v11.45H3.56V9zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
              </svg>
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero container">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">SENIOR DEVOPS / PLATFORM ENGINEER</div>
              <h1>Building infrastructure that helps engineering teams <em>move faster.</em></h1>
              <p className="hero-lede">
                I build reliable cloud platforms and developer workflows that make software delivery faster,
                safer, and easier to operate.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#work">View my work <ChevronRight size={17} /></a>
                <a className="button secondary" href="/resume.pdf">Download resume <ArrowDownRight size={17} /></a>
              </div>
              <div className="hero-links">
                <a href={githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
                <a href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
                <a href="mailto:">Email <ArrowUpRight size={14} /></a>
              </div>
            </div>

            <div className="hero-terminal" aria-label="Engineering focus">
              <div className="terminal-top"><span /><span /><span /><label>platform.ts</label></div>
              <pre>{`const platform = {
  cloud: "AWS",
  orchestration: "Kubernetes",
  iac: "Terraform",
  delivery: "GitOps",
  observability: "Prometheus",
  focus: [
    "reliability",
    "automation",
    "developer experience"
  ]
}`}</pre>
              <div className="terminal-status"><i /> systems designed to be operated</div>
            </div>
          </div>
        </section>

        <section className="impact">
          <div className="container impact-grid">
            <Metric value="8" label="years of experience" />
            <Metric value="20%" label="compute cost reduction*" />
            <Metric value="60" label="microservices on GitOps" />
            <Metric value="3" label="Kubernetes environments" />
          </div>
          <div className="container footnote">* Karpenter + ARM64 optimization outcome.</div>
        </section>

        <section id="about" className="section container">
          <div className="section-label">01 — ABOUT</div>
          <div className="about-grid">
            <h2>Infrastructure is more than keeping servers running.</h2>
            <div className="about-copy">
              <p>
                I specialize in building and operating cloud platforms that enable engineering teams to
                ship software reliably at scale.
              </p>
              <p>
                My work spans infrastructure automation, Kubernetes platform engineering, CI/CD,
                observability, cloud networking, databases, and developer tooling. I enjoy taking
                infrastructure problems that are manual, fragile, or difficult to scale and turning them
                into predictable, automated systems.
              </p>
              <p>
                I work closely with engineers and technical leadership to understand the underlying problem,
                make pragmatic architectural decisions, and build platforms that are secure, maintainable,
                and easy to operate.
              </p>
            </div>
          </div>
        </section>

        <section id="work" className="section work-section">
          <div className="container">
            <div className="section-label">02 — SELECTED ENGINEERING WORK</div>
            <div className="section-heading">
              <h2>Problems solved in production.</h2>
              <p>Architecture, automation, and measurable outcomes—not just a list of tools.</p>
            </div>

            <CaseStudy
              number="01"
              title="Dynamic Kubernetes Capacity"
              subtitle="Karpenter on Amazon EKS"
              summary="Owned the implementation end-to-end, introducing dynamic EC2 provisioning, ARM64 workloads and consolidation across a 15–20 node workload footprint."
              tags={['AWS', 'EKS', 'Karpenter', 'ARM64', 'Terraform', 'Kubernetes']}
              metrics={[
                { value: '20%', label: 'compute cost reduction' },
                { value: '15–20', label: 'nodes / workloads' },
                { value: 'ARM64', label: 'cost-optimized capacity' },
              ]}
              architecture={<KarpenterDiagram />}
              href="/work/karpenter"
            />

            <CaseStudy
              number="02"
              title="GitOps at Scale"
              subtitle="Argo CD + GitHub Actions + Amazon ECR"
              summary="Led the implementation of a GitOps-based Kubernetes delivery platform across 4 applications, approximately 60 microservices, and 3 environments."
              tags={['Argo CD', 'GitOps', 'EKS', 'GitHub Actions', 'ECR', 'Kubernetes']}
              metrics={[
                { value: '20%', label: 'fewer manual deployment steps' },
                { value: '30%', label: 'faster deployments' },
                { value: '55%', label: 'fewer deployment incidents' },
              ]}
              architecture={<GitOpsDiagram />}
              href="/work/gitops"
            />
          </div>
        </section>

        <section id="experience" className="section container">
          <div className="section-label">03 — EXPERIENCE</div>
          <div className="experience">
            <article className="experience-row">
              <div className="experience-meta"><span>Current</span><span>MAX</span></div>
              <div>
                <h3>Senior Infrastructure / DevOps Engineer</h3>
                <p>Leading the DevOps and Infrastructure function across cloud infrastructure, Kubernetes, CI/CD, observability, reliability, and platform engineering.</p>
                <ul>
                  <li>Lead and mentor 2 engineers and own the platform roadmap.</li>
                  <li>Partner with CTO, VP and Director-level stakeholders on platform strategy.</li>
                  <li>Design and operate AWS infrastructure and EKS platforms.</li>
                  <li>Drive infrastructure automation using Terraform and AWS CDK.</li>
                </ul>
              </div>
            </article>
            <article className="experience-row">
              <div className="experience-meta"><span>Previous</span><span>HEETCH</span></div>
              <div>
                <h3>DevOps / Infrastructure Engineer</h3>
                <p>Built and operated cloud infrastructure and developer tooling supporting engineering teams.</p>
                <ul><li>Successfully migrated CI workloads from Drone CI to GitHub Actions.</li></ul>
              </div>
            </article>
            <article className="experience-row">
              <div className="experience-meta"><span>Previous</span><span>SDI ENTERPRISES</span></div>
              <div>
                <h3>Infrastructure / DevOps Engineer</h3>
                <p>Worked across cloud infrastructure, automation, CI/CD and enterprise platform engineering.</p>
              </div>
            </article>
            <article className="experience-row">
              <div className="experience-meta"><span>Earlier</span><span>BANKING</span></div>
              <div>
                <h3>Infrastructure / Technology Leadership</h3>
                <p>5+ years of leadership and management experience across banking technology environments.</p>
              </div>
            </article>
          </div>
        </section>

        <section id="stack" className="section stack-section">
          <div className="container">
            <div className="section-label">04 — TECHNOLOGY</div>
            <div className="stack-grid">
              <div className="stack-group">
                <div className="stack-icon"><Cloud size={19} /></div>
                <h3>Cloud & Infrastructure</h3>
                <p>AWS · EC2 · EKS · RDS · Aurora · S3 · CloudFront · Route 53 · IAM · VPC</p>
              </div>
              <div className="stack-group">
                <div className="stack-icon"><Layers3 size={19} /></div>
                <h3>Platform Engineering</h3>
                <p>Kubernetes · Karpenter · Helm · Argo CD · GitOps · Kong · Gateway API</p>
              </div>
              <div className="stack-group">
                <div className="stack-icon"><Code2 size={19} /></div>
                <h3>Infrastructure as Code</h3>
                <p>Terraform · AWS CDK · Ansible</p>
              </div>
              <div className="stack-group">
                <div className="stack-icon"><GitBranch size={19} /></div>
                <h3>CI/CD</h3>
                <p>GitHub Actions · Jenkins · GitLab · Docker · Amazon ECR</p>
              </div>
              <div className="stack-group">
                <div className="stack-icon"><ShieldCheck size={19} /></div>
                <h3>Observability & Reliability</h3>
                <p>Prometheus · Grafana · CloudWatch · monitoring · incident response</p>
              </div>
              <div className="stack-group">
                <div className="stack-icon"><Terminal size={19} /></div>
                <h3>Languages</h3>
                <p>Python · Bash · TypeScript · JavaScript</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section approach container">
          <div className="section-label">05 — HOW I WORK</div>
          <div className="approach-grid">
            <div>
              <h2>Understand → Design → Automate → Measure.</h2>
            </div>
            <div className="approach-list">
              <div><b>01</b><span><strong>Understand the problem</strong>Start with the engineering and business constraint rather than the technology.</span></div>
              <div><b>02</b><span><strong>Design for the operating model</strong>Build for the people who will operate, debug, modify and scale the platform.</span></div>
              <div><b>03</b><span><strong>Automate the repeatable</strong>Infrastructure, deployments and operational workflows should be reproducible and version controlled.</span></div>
              <div><b>04</b><span><strong>Measure the outcome</strong>Cost, reliability, deployment velocity and developer experience matter more than tool count.</span></div>
            </div>
          </div>
        </section>

        <section className="infra-section">
          <div className="container">
            <div className="section-label">06 — THIS WEBSITE IS INFRASTRUCTURE TOO</div>
            <div className="infra-grid">
              <div>
                <h2>Built with the same principles I use in production.</h2>
                <p>
                  This site is designed as a small production system: infrastructure as code, automated
                  delivery, least-privilege access, managed AWS services, and no server to maintain.
                </p>
                <div className="tag-row">
                  {['Terraform', 'AWS', 'S3', 'CloudFront', 'Route 53', 'ACM', 'GitHub Actions', 'OIDC', 'React', 'TypeScript'].map((x) => <Tag key={x}>{x}</Tag>)}
                </div>
                <a className="text-link" href={githubUrl} target="_blank" rel="noreferrer">View source on GitHub <ArrowUpRight size={16} /></a>
              </div>
              <div className="site-architecture">
                <div className="site-flow"><span>GitHub</span><ArrowDownRight /><span>Actions</span><ArrowDownRight /><span>Terraform</span></div>
                <div className="site-flow second"><span>Route 53</span><ArrowDownRight /><span>CloudFront</span><ArrowDownRight /><span>S3</span></div>
                <div className="security-note"><ShieldCheck size={17} /><span>Private S3 + CloudFront OAC + HTTPS + GitHub OIDC</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="resume-cta container">
          <div>
            <div className="eyebrow">THE COMPLETE PICTURE</div>
            <h2>Want the complete picture?</h2>
            <p>View my full experience, technical background and career history in my resume.</p>
          </div>
          <a className="button primary" href="/resume.pdf">Download resume <ArrowDownRight size={17} /></a>
        </section>

        <section id="contact" className="contact-section">
          <div className="container contact-inner">
            <div className="section-label">07 — CONTACT</div>
            <h2>Let's build something reliable.</h2>
            <p>
              I'm interested in senior DevOps, Platform Engineering and Infrastructure roles where I can
              help build scalable platforms and improve the way engineering teams deliver software.
            </p>
            <div className="contact-links">
              <a href={githubUrl} target="_blank" rel="noreferrer"><SiGithub size={18} /> GitHub <ArrowUpRight size={14} /></a>
              <a href={linkedinUrl} target="_blank" rel="noreferrer">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.38 4.28 5.48v6.26zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM3.56 9h3.56v11.45H3.56V9zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
                </svg> LinkedIn <ArrowUpRight size={14} />
              </a>
              <a href="mailto:"><Terminal size={18} /> Email <ArrowUpRight size={14} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer container">
        <div>
          <strong>MOMOH SANI MUSA</strong>
          <span>Senior DevOps / Platform Engineer</span>
        </div>
        <div className="footer-right">
          <span>AWS · Kubernetes · Terraform · Platform Engineering</span>
          <span>© 2026 Momoh Sani Musa</span>
        </div>
      </footer>
    </div>
  )
}



function CaseStudyPage({ kind }: { kind: 'karpenter' | 'gitops' }) {
  const isKarpenter = kind === 'karpenter'
  const title = isKarpenter ? 'Dynamic Kubernetes Capacity' : 'GitOps at Scale'
  const subtitle = isKarpenter
    ? 'Karpenter on Amazon EKS'
    : 'Argo CD + GitHub Actions + ECR'
  const intro = isKarpenter
    ? 'Moving EKS capacity from fixed node groups to dynamic provisioning with Karpenter, ARM64 and consolidation.'
    : 'Separating build from deployment with GitHub Actions, ECR, GitOps and Argo CD across three Kubernetes environments.'

  return (
    <div className="site-shell routed-page">
      <header className="site-header container">
        <a className="brand" href="/">MOMOH SANI MUSA</a>
        <a className="back-link" href="/#work"><ChevronRight size={15} /> Back to selected work</a>
      </header>
      <main>
        <section className="section case-hero container">
          <div className="eyebrow">CASE STUDY / {subtitle.toUpperCase()}</div>
          <h1>{title}</h1>
          <p className="hero-copy">{intro}</p>
        </section>
        <section className="section case-content container">
          {isKarpenter ? <KarpenterCase /> : <GitOpsCase />}
        </section>
      </main>
      <footer className="footer container"><div><strong>MOMOH SANI MUSA</strong><span>Senior DevOps / Platform Engineer</span></div></footer>
    </div>
  )
}

function CaseBlock({ title, children }: { title: string; children: ReactNode }) {
  return <section className="case-block"><h2>{title}</h2><div className="case-block-body">{children}</div></section>
}

function Architecture({ children }: { children: ReactNode }) {
  return <div className="case-architecture">{children}</div>
}

function KarpenterCase() {
  return <>
    <CaseBlock title="The problem"><p>The EKS platform relied on fixed managed node groups. Capacity had to be planned ahead of workload demand, creating over-provisioning and making scheduling less responsive as workloads changed.</p></CaseBlock>
    <CaseBlock title="What I changed"><ul><li>Owned the Karpenter implementation end-to-end.</li><li>Introduced NodePools and EC2NodeClasses for dynamic provisioning.</li><li>Added ARM64 capacity where workload compatibility allowed it.</li><li>Enabled consolidation to remove unnecessary capacity.</li><li>Designed around CPU/memory requirements, availability zones, labels, taints and critical system workloads.</li></ul></CaseBlock>
    <CaseBlock title="Architecture"><Architecture><span>Workloads</span><b>→</b><span>EKS</span><b>→</b><span>Karpenter</span><b>→</b><span>NodePool</span><b>→</b><span>EC2NodeClass</span><b>→</b><span>EC2 capacity</span></Architecture></CaseBlock>
    <CaseBlock title="Engineering considerations"><p>Dynamic provisioning is only useful when scheduling constraints are explicit. I treated instance architecture, CPU and memory requirements, AZ placement, workload constraints, baseline capacity, IAM and consolidation behavior as part of the platform design.</p></CaseBlock>
    <CaseBlock title="Outcome"><div className="case-metrics"><Metric value="~20%" label="compute cost reduction*" /><Metric value="15–20" label="nodes/workloads in scope" /><Metric value="ARM64" label="used for eligible workloads" /></div><small>*Portfolio metric; validate against internal reporting before publishing externally.</small></CaseBlock>
  </>
}

function GitOpsCase() {
  return <>
    <CaseBlock title="The problem"><p>Deployments relied on raw Kubernetes manifests and manual steps. As the platform grew, deployments became harder to audit, standardize and operate consistently across environments.</p></CaseBlock>
    <CaseBlock title="What I changed"><ul><li>Implemented Argo CD and GitOps as the continuous delivery layer.</li><li>Kept GitHub Actions responsible for tests, validation, image builds and publishing artifacts to ECR.</li><li>Updated the GitOps repository with the desired image version.</li><li>Used Argo CD to reconcile desired state into EKS.</li><li>Configured automatic synchronization for lower environments and manual promotion for production.</li></ul></CaseBlock>
    <CaseBlock title="Delivery flow"><Architecture><span>Developer</span><b>→</b><span>GitHub</span><b>→</b><span>Actions</span><b>→</b><span>ECR</span><b>→</b><span>GitOps repo</span><b>→</b><span>Argo CD</span><b>→</b><span>EKS</span></Architecture></CaseBlock>
    <CaseBlock title="Operating model"><p>CI produces and validates immutable artifacts. Git stores desired deployment state. Argo CD continuously reconciles that state with the cluster. This separation reduced direct cluster access, made changes auditable through Git and provided a clear rollback path.</p></CaseBlock>
    <CaseBlock title="Outcome"><div className="case-metrics"><Metric value="4" label="applications" /><Metric value="~60" label="microservices" /><Metric value="3" label="Kubernetes environments" /><Metric value="25/mo" label="Argo CD deployments" /></div><div className="case-pills"><span>20% fewer manual deployment steps</span><span>30% faster deployments</span><span>55% fewer deployment-related incidents</span></div><small>Portfolio metrics supplied for this case study; validate against internal reporting before publishing externally.</small></CaseBlock>
  </>
}

function ResumePage() {
  return <div className="site-shell routed-page"><header className="site-header container"><a className="brand" href="/">MOMOH SANI MUSA</a></header><main className="section container routed-content"><div className="eyebrow">RESUME</div><h1>Momoh Sani Musa</h1><p className="hero-copy">Senior DevOps / Platform Engineer</p><div className="hero-actions"><a className="button primary" href="/resume.pdf" target="_blank" rel="noreferrer">Open resume <ArrowUpRight size={16} /></a><a className="button" href="/">Back home</a></div></main></div>
}

function NotFoundPage() {
  return <div className="site-shell routed-page"><main className="section container routed-content"><div className="eyebrow">404</div><h1>Page not found.</h1><p className="hero-copy">The page you're looking for doesn't exist.</p><a className="button primary" href="/">Back home</a></main></div>
}

function Router() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return <Home />
  if (path === '/work/karpenter') return <CaseStudyPage kind="karpenter" />
  if (path === '/work/gitops') return <CaseStudyPage kind="gitops" />
  if (path === '/resume') return <ResumePage />
  return <NotFoundPage />
}

export default Router
