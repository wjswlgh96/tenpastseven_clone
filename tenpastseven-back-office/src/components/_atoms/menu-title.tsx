import styles from "@/styles/_atoms/menu-title.module.css";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export default function MenuTitle(props: Props) {
  const { children, className, ...filterProps } = props;

  return (
    <h2 className={`${styles.menu_title} ${className}`} {...filterProps}>
      {children}
    </h2>
  );
}
