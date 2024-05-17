import { Link, type LinkProps } from 'react-router-dom';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from './BButton';
import { cn } from '@/utils/styles';

type LinkButtonProps = LinkProps & VariantProps<typeof buttonVariants>;

const LinkButton = (props: LinkButtonProps) => (
  <Link
    {...props}
    className={cn(
      buttonVariants({
        variant: props.variant,
        size: props.size,
        className: props.className,
      }),
    )}
  >
    {props.children}
  </Link>
);

export default LinkButton;
