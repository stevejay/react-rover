/** @jsxImportSource @emotion/react */
import { forwardRef, LinkHTMLAttributes } from 'react';
import styled from '@emotion/styled';

const StyledLink = styled.a`
  outline: none;
  display: inline-block;
  border: 1px solid rgba(27, 31, 36, 0.15);
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: center;
  background: rgb(246, 248, 250);
  color: rgb(36, 41, 47);
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  transition-property: color, background-color, border-color;

  &:hover {
    background-color: rgb(243, 244, 246);
  }

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
  }
`;

export type LinkProps = Omit<LinkHTMLAttributes<HTMLAnchorElement>, 'as'> & {
  label: string;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ label, href, ...rest }, ref) => (
  <StyledLink {...rest} ref={ref} href={href} rel="noopener noreferrer nofollow" target="_blank">
    {label}
  </StyledLink>
));
