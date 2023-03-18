export interface Menu {
  title: string
  icon: string
  children: SubMenu[]
}
interface SubMenu {
  title: string
  children: Link[]
}
interface Link {
  title: string
  link: string
}