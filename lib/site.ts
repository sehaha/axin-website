export const site = {
  name: "AXIN International Group",
  shortName: "AXIN",
  description:
    "AXIN International Group is a U.S.-based technology and integrated services group connecting technology, capital, talent and global opportunity.",
  url: "https://axingroup.com",
  tagline: "Powering the Next Generation of Global Growth.",
};

// 集团旗下各实体的独立站点。既用于生态板块的外链，也作为结构化数据的 sameAs——
// 让搜索引擎和 AI 抓取器把这几个域名和 AXIN 关联成同一个实体网络。
export const entities = [
  {
    position: "unit-a",
    category: "TECHNOLOGY",
    name: "AXIN Intelligent Systems",
    href: "https://eduready.ai/",
  },
  {
    position: "unit-b",
    category: "GLOBAL SERVICES",
    name: "YUNO Family Office",
    href: "https://www.yunofamilyoffice.com/",
  },
  {
    position: "unit-c",
    category: "CAPITAL",
    name: "METO Capital",
    href: "https://www.metocapital.com/",
  },
  {
    position: "unit-d",
    category: "EDUCATION & TALENT",
    name: "Aili Academy",
    href: "https://www.ailiacademy.com/",
  },
] as const;
