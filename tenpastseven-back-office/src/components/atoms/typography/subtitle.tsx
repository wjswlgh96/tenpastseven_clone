import styles from "./subtitle.module.css";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export default function SubTitle(props: Props) {
  const { children, className, ...filterProps } = props;
  return (
    <h4 className={`${styles.subtitle} ${className}`} {...filterProps}>
      {children}
    </h4>
  );
}
