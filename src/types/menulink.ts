export interface MenuLink {
  title: string
  icon: string
  children: ChildInMenuLink[]
}
interface ChildInMenuLink {
  title: string
  children: Link[]
}
interface Link {
  title: string
  link: string
}