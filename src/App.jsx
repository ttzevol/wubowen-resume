import { useState, useEffect, useRef } from 'react'
import './App.css'

// WebGL Gradient Background
function AtmospherePanel({ name, title, email }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = {
      top: { r: 160, g: 174, b: 227 },
      mid: { r: 235, g: 195, b: 168 },
      bottom: { r: 255, g: 107, b: 74 }
    }

    const noise = (x, y, t) => {
      const s = Math.sin(x * 12.9898 + y * 78.233 + t * 0.1) * 43758.5453123
      return s - Math.floor(s)
    }

    const draw = () => {
      time += 0.016
      const { width, height } = canvas
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      const shift = Math.sin(time * 0.3) * 0.05
      gradient.addColorStop(0, `rgb(${colors.top.r}, ${colors.top.g + shift * 20}, ${colors.top.b})`)
      gradient.addColorStop(0.5, `rgb(${colors.mid.r}, ${colors.mid.g}, ${colors.mid.b})`)
      gradient.addColorStop(1, `rgb(${colors.bottom.r}, ${colors.bottom.g}, ${colors.bottom.b})`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % width
        const y = Math.floor((i / 4) / width)
        const n = noise(x, y, time) * 0.08 - 0.04
        data[i] = Math.min(255, Math.max(0, data[i] + n * 255))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n * 255))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 255))
      }
      ctx.putImageData(imageData, 0, 0)
      ctx.save()
      ctx.globalAlpha = 0.03
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(0, height * (0.3 + i * 0.2))
        for (let x = 0; x <= width; x += 10) {
          const y = height * (0.3 + i * 0.2) + Math.sin((x / width) * 6 + time * 0.5 + i) * 30
          ctx.lineTo(x, y)
        }
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      }
      ctx.restore()
      animationId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="panel-atmosphere">
      <canvas ref={canvasRef} className="webgl-canvas" />
      <div className="identity-content">
        <div className="identity-dots">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
        <div className="identity-bottom">
          <div className="identity-name">{name}</div>
          <div className="identity-title">{title}</div>
          <div className="identity-contact">{email}</div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title, date }) {
  return (
    <div className="section-header">
      <div className="header-title-group">
        <span className="micro-label" style={{ margin: 0 }}>{title}</span>
        <span className="header-symbols">✦ ⬩ ▾</span>
      </div>
      {date && <div className="header-date">{date}</div>}
    </div>
  )
}

function SkillTag({ label, level }) {
  return (
    <div className="skill-tag">
      <span className="skill-label">{label}</span>
      <span className="skill-level">{level}</span>
    </div>
  )
}

function ProjectCard({ title, period, description, tech, highlights }) {
  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-title">{title}</div>
        {period && <div className="project-period">{period}</div>}
      </div>
      <p className="project-desc">{description}</p>
      <div className="project-tech">
        {tech.map((t, i) => <span key={i} className="tech-badge">{t}</span>)}
      </div>
      <ul className="project-highlights">
        {highlights.map((h, i) => <li key={i}>{h}</li>)}
      </ul>
    </div>
  )
}

function ExperienceCard({ dates, company, role, description, tech }) {
  return (
    <div className="exp-card">
      <div className="exp-header">
        <div className="exp-meta">
          <span className="exp-dates">{dates}</span>
          <span className="exp-company">{company}</span>
        </div>
        <div className="exp-role">{role}</div>
      </div>
      <p className="exp-desc">{description}</p>
      <div className="exp-tech">
        {tech.map((t, i) => <span key={i} className="tech-badge-sm">{t}</span>)}
      </div>
    </div>
  )
}

function MiniBar({ value, color }) {
  const pct = Math.min(100, Math.max(10, value))
  return (
    <div className="mini-bar-track">
      <div className={`mini-bar-fill ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function CapacityBar({ value }) {
  return (
    <div className="capacity-bar-container">
      <div className="capacity-bar-fill" style={{ width: `${value}%` }}>
        <span className="capacity-number">{value}</span>
      </div>
    </div>
  )
}

function PrintButton() {
  return (
    <button className="print-btn" onClick={() => window.print()} title="导出 PDF">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
      导出 PDF
    </button>
  )
}

function App() {
  const today = new Date()
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`

  const skills = {
    expert: ['Java 核心 & 并发编程', 'Spring Boot/Cloud/Alibaba', 'JVM 实战调优', 'MySQL/PostgreSQL/SQLServer', 'LangChain / LangGraph', 'RAG + RAGAS', 'FastAPI / SpringAI', '微服务架构'],
    familiar: ['分布式事务/锁/一致性', 'Redis / RocketMQ', 'Elasticsearch', 'ShardingSphere 分库分表', 'Dense/Sparse 混合检索', 'ReRanker 模型重排', 'P-tuning / LoRA 微调', 'MoE / Transformer 原理'],
    frontend: ['HTML / CSS / JS', 'Vue.js', 'Chroma / Milvus', 'UnstructuredLoader', 'OCR 识别'],
  }

  const experiences = [
    {
      dates: '2023.06 — 2025.10',
      company: '成都医云方数字科技有限公司',
      role: '后端工程师',
      description: '主导构建 DRG/DIP 医保支付一体化平台从0到1的系统架构，成功在100余家医院落地实施。领导团队完成 ERP & CRM 全生命周期系统的设计与开发，系统稳定支撑公司年均10亿元的销售业务高效运转。负责公司 AI 大模型应用开发，根据公司业务进行大模型微调，赋能公司多个核心产品。',
      tech: ['Java', 'Spring Cloud Alibaba', 'MySQL', 'PostgreSQL', 'Dubbo', 'Redis', 'LangChain', 'LangGraph', 'FastAPI', 'Milvus', 'Flowable', 'Elasticsearch']
    },
    {
      dates: '2019.06 — 2023.06',
      company: '成都思多科医疗科技有限公司',
      role: 'Java 开发',
      description: '主要负责公司项目架构设计、核心功能开发维护、项目上线部署及前端相关页面开发。主导云影线上会诊系统（互联网医院）的设计与开发，核心功能包括异步/同步会诊、订单预约、在线支付、报告编辑等。',
      tech: ['Java', 'Spring Cloud', 'MySQL', 'MyBatis', 'Redis', 'OSS', 'Zookeeper', 'Quartz', 'Docker', 'Vue']
    }
  ]

  const projects = [
    {
      title: 'ERP AI 智能助手',
      period: '2025.6 — 2025.10',
      description: '基于 LangChain + LangGraph 框架开发多个 Agent + WorkFlow 实现智能服务助手，聚焦多轮对话管理、多任务链路执行和工具调用能力。',
      tech: ['LangChain', 'LangGraph', 'FastAPI', 'Milvus', 'UnstructuredLoader', 'RAGAS', 'DeepSeek-V3'],
      highlights: [
        '工具函数模块：提取 ERP 业务为 LangChain 工具，绑定只读/敏感操作分类',
        '身份权限模块：通过 interrupt_before 中断敏感操作，RedisSaver 保存上下文',
        '多 Agent 调度：主 Agent 居中调度商务/采购/质管/财务四个子工作流',
        '动态路由：add_conditional_edges 实现子工作流动态路由，dialog_stack 管理状态'
      ]
    },
    {
      title: '基于大模型的 RAG 医保知识库系统',
      period: '2025.1 — 2025.10',
      description: '针对医保领域大模型知识滞后、幻觉率高的问题，构建 RAG 系统实现实时知识更新与可验证回答，问答准确率从 62% 显著提升。',
      tech: ['LangChain', 'LangGraph', 'FastAPI', 'Milvus', 'PyMuPDF', 'RAGAS', 'bge-large-zh-v1.5', 'BM25', 'DeepSeek-V3'],
      highlights: [
        'Milvus 分布式集群 Docker 部署，弹性扩展节点',
        'PDF/PPT 解析：PyMuPDF + UnstructuredLoader (hi_res) + Tesseract OCR',
        '混合检索：Dense 向量(bge-large) + Sparse 向量(BM25/DAAT) + ReRanker 重排',
        '两层评估：Corrective RAG + Adaptive RAG，输入关联性 + 检索相关性双重评估'
      ]
    },
    {
      title: '自研 ERP 平台',
      period: '2025.1 — 2025.6',
      description: '新一代 ERP 系统支撑公司十亿销售额规模，订单处理能力提升，财务月结效率从 7 天缩短至 2 天。',
      tech: ['Java', 'Spring Cloud Alibaba', 'PostgreSQL', 'Dubbo', 'Redis', 'RocketMQ', 'Elasticsearch', 'Flowable', 'SSE'],
      highlights: [
        '微服务架构：Dubbo RPC + Redis 热点缓存 + 高可用部署',
        '全域主数据管理：统一数据模型 + 版本控制 + ES 多维度实时检索（毫秒级）',
        '供应链核心模块：资料变更 → 审批流 → 采购计划/订单闭环',
        '事件驱动：RocketMQ 异步解耦，吞吐量提升 3 倍'
      ]
    },
    {
      title: 'DRG/DIP 医保支付一体化平台',
      period: '2023.12 — 2025.1',
      description: '为医院客户提供智能结算与质控系统，赋能医院 DRG/DIP 支付改革转型，已上线 100+ 医院。',
      tech: ['Java', 'Spring Cloud Alibaba', 'SQLServer', 'PostgreSQL', 'Dubbo', 'Redis', 'RocketMQ', 'ShardingSphere'],
      highlights: [
        '高并发数据处理：分批多线程 + 缓存 + 消息中间件',
        '分组核心：策略/代理/构建者/装饰器设计模式',
        'RocketMQ 异步解耦核心业务，降低数据不一致风险',
        'ShardingSphere 千万级数据分表，JPA 二次封装解决多数据库兼容'
      ]
    },
    {
      title: '病案首页 & 结算清单质控引擎',
      period: '2023.12 — 2025.1',
      description: 'Groovy 动态规则引擎 + 高并发质控，单份病案首页质控从 15s 降至 2s 内，支撑单日 10万+ 份批量质检。',
      tech: ['Java', 'Spring Boot', 'Groovy', 'Dubbo', 'Redis'],
      highlights: [
        'Groovy 脚本动态加载规则引擎，预编译 + 缓存，支撑万级规则高效执行',
        'Dubbo 服务拆分 + Redis 缓存预加载核心码表',
        '平均质控耗时：15s → 2s 以内'
      ]
    },
    {
      title: 'CRM 客户关系管理系统',
      period: '2023.6 — 2023.12',
      description: '打通民营医院、KA 客户及会员的数据与服务体系，实现精细化运营与客户生命周期价值挖掘。',
      tech: ['Java', 'Spring Cloud Alibaba', 'Elasticsearch', 'MySQL', 'Dubbo', 'Redis', 'Groovy'],
      highlights: [
        'ES 构建客户行为实时检索，查询响应时间秒级 → 毫秒',
        'Redis 分布式锁 + 缓存策略应对高并发',
        'Groovy 动态规则引擎配置客户分群与触达策略'
      ]
    },
    {
      title: '云影线上会诊系统（互联网医院）',
      period: '2021.1 — 2023.6',
      description: '超声/CT/MR 互联网医院，简化体检流程，支持远程实时会诊与 AI 辅助筛查。',
      tech: ['Java', 'Spring Cloud', 'MySQL', 'Redis', 'OSS', '微信支付', 'Zookeeper', 'Quartz'],
      highlights: [
        '雪花算法保证订单 ID 唯一性',
        '分布式锁实现抢单模块',
        'Redis 缓存高频数据（点赞/评论）',
        'JWT + Redis 管理 Token 过期，OSS 文件上传下载',
        'Zuul 过滤器兼容老项目 URL，灰度发布方案落地'
      ]
    }
  ]

  return (
    <div className="resume-body">
      <AtmospherePanel
        name="伍博文 / Wu Bowen"
        title="Backend Engineer & AI Developer"
        email="834872527@qq.com"
      />

      <div className="panel-data">
        <PrintButton />
        {/* Status */}
        <SectionHeader title="CURRENT STATUS" date={dateStr} />
        <div className="hero-metric">
          <div className="hero-number">06</div>
          <div className="hero-unit">yrs active · 后端工程师 · AI 开发</div>
        </div>

        {/* Skills */}
        <div className="section-block">
          <SectionHeader title="TECHNICAL SKILLS" />
          <div className="skill-group">
            <div className="skill-group-label">精通</div>
            <div className="skill-tags">
              {skills.expert.map((s, i) => <SkillTag key={i} label={s} level="精通" />)}
            </div>
          </div>
          <div className="skill-group">
            <div className="skill-group-label">熟悉</div>
            <div className="skill-tags">
              {skills.familiar.map((s, i) => <SkillTag key={i} label={s} level="熟悉" />)}
            </div>
          </div>
          <div className="skill-group">
            <div className="skill-group-label">其他</div>
            <div className="skill-tags">
              {skills.frontend.map((s, i) => <SkillTag key={i} label={s} level="熟练" />)}
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="section-block">
          <SectionHeader title="WORK EXPERIENCE" />
          {experiences.map((exp, i) => (
            <ExperienceCard key={i} {...exp} />
          ))}
        </div>

        {/* Projects */}
        <div className="section-block">
          <SectionHeader title="PROJECT HIGHLIGHTS" />
          {projects.map((proj, i) => (
            <ProjectCard key={i} {...proj} />
          ))}
        </div>

        {/* Education */}
        <div className="section-block">
          <SectionHeader title="EDUCATION" />
          <div className="edu-card">
            <div className="edu-header">
              <span className="edu-dates">2015.09 — 2019.06</span>
              <span className="edu-school">四川大学锦江学院</span>
            </div>
            <div className="edu-degree">软件工程 · 本科</div>
          </div>
        </div>

        {/* Contact */}
        <div className="section-block">
          <SectionHeader title="CONTACT" />
          <div className="contact-row">
            <div className="contact-item">
              <span className="micro-label">EMAIL</span>
              <span className="contact-value">834872527@qq.com</span>
            </div>
            <div className="contact-item">
              <span className="micro-label">PHONE</span>
              <span className="contact-value">186-0837-5837</span>
            </div>
            <div className="contact-item">
              <span className="micro-label">BLOG</span>
              <span className="contact-value">blog.csdn.net/weixin_43548119</span>
            </div>
          </div>
        </div>

        {/* Core expertise bar */}
        <div className="section-block">
          <span className="micro-label">CORE EXPERTISE INDEX</span>
          <CapacityBar value={82} />
        </div>
      </div>
    </div>
  )
}

export default App
