import styles from "@/styles/atoms/select.module.css";

type Props = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

export default function Select(props: Props) {
  const { children, className, ...filterProps } = props;
  return (
    <select className={`${styles.select} ${className}`} {...filterProps}>
      {children}
    </select>
  );
}
