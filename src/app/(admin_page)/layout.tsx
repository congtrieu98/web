import React, { PropsWithChildren } from 'react';

export default function LayoutDashBoard({ children }: PropsWithChildren) {
  return (
    <div className="h-full w-full block relative">
      {React.Children.map(children, (child) => {
        if (child) {
          return child;
        }
      })}
    </div>
  );
}
