import { Bug, Globe, Sword, Shield } from 'lucide-react'

export const BADGE_DEFS = [
  {
    id: 'FIRST_PATCH',
    icon: Bug,
    emoji: '🕷️',
    color: 'text-accent',
    glowVar: '--glow-accent',
    borderActive: 'border-accent/50',
    bgActive: 'bg-accent/10',
  },
  {
    id: 'GUILD_MEMBER',
    icon: Globe,
    emoji: '🌐',
    color: 'text-primary',
    glowVar: '--glow-primary',
    borderActive: 'border-primary/50',
    bgActive: 'bg-primary/10',
  },
  {
    id: 'BOUNTY_HUNTER',
    icon: Sword,
    emoji: '⚔️',
    color: 'text-streak',
    glowVar: '--glow-primary',
    borderActive: 'border-streak/50',
    bgActive: 'bg-streak/10',
  },
  {
    id: 'FOUNDATIONS_MASTER',
    icon: Shield,
    emoji: '🛡️',
    color: 'text-success',
    glowVar: '--glow-accent',
    borderActive: 'border-success/50',
    bgActive: 'bg-success/10',
  },
]
