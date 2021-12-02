/** @jsxImportSource @emotion/react */
import { forwardRef, LinkHTMLAttributes } from 'react';
import styled from '@emotion/styled';

const StyledLink = styled.a`
  border: 1px solid white;
  outline: none;
  display: inline-block;
  padding: 6px 12px;
  border-radius: 5px;
  text-align: center;
  background: white;
  color: #222428;
  font-size: 14px;
  line-height: 1.5em;
  margin-right: 4px;
  font-family: sans-serif;

  &:hover {
    border-color: #005a9c;
    background: rgb(226, 239, 255);
  }

  &:focus-within {
    border-width: 2px;
    border-color: #005a9c;
    background: rgb(226, 239, 255);
    padding: 5px 11px;
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
