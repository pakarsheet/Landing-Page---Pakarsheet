import { Package, BookOpen, Inbox } from "lucide-react";

export interface ActivityItem {
  id: string;
  type: "product" | "post" | "order";
  label: string;
  sub: string;
  time: string;
  href: string;
}

interface Props {
  items: ActivityItem[];
}

const iconMap = {
  product: { Icon: Package,  bg: "bg-leaf",  color: "text-ink"    },
  post:    { Icon: BookOpen, bg: "bg-blush", color: "text-cobalt" },
  order:   { Icon: Inbox,    bg: "bg-sky/40",color: "text-cobalt" },
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return "baru saja";
  if (mins < 60)  return `${mins} mnt lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7)   return `${days} hari lalu`;
  return new Date(isoString).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function ActivityFeed({ items }: Props) {
  if (!items.length) {
    return (
      <div className="py-10 text-center text-sm text-muted">Belum ada aktivitas</div>
    );
  }

  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const { Icon, bg, color } = iconMap[item.type];
        return (
          <li key={`${item.type}-${item.id}`}>
            <a
              href={item.href}
              className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-[#f4f6fb]"
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{item.label}</p>
                <p className="truncate text-xs text-muted">{item.sub}</p>
              </div>
              <span className="shrink-0 text-xs text-muted">{timeAgo(item.time)}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
