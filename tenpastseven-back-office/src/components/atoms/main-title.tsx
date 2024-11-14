import styles from "@/styles/atoms/main-title.module.css";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export default function MainTitle(props: Props) {
  const { className, children, ...filterProps } = props;

  return (
    <h1 className={`${styles.title} ${className}`} {...filterProps}>
      {children}
    </h1>
  );
}
