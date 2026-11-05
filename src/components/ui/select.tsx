// AlignUI Select v1.2 — adapted to the Zemo CSS token layer.
import * as React from "react";
import * as ScrollAreaPrimitives from "@radix-ui/react-scroll-area";
import * as SelectPrimitives from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";

const SelectRoot = SelectPrimitives.Root;
const SelectValue = SelectPrimitives.Value;

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Trigger>
>(({ className, children, ...rest }, forwardedRef) => (
  <SelectPrimitives.Trigger
    ref={forwardedRef}
    className={`align-select-trigger${className ? ` ${className}` : ""}`}
    {...rest}
  >
    {children}
    <SelectPrimitives.Icon asChild>
      <Icon icon={ChevronDownIcon} size={16} className="align-select-arrow" />
    </SelectPrimitives.Icon>
  </SelectPrimitives.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Content>
>(({ className, position = "popper", children, sideOffset = 8, ...rest }, forwardedRef) => (
  <SelectPrimitives.Portal>
    <SelectPrimitives.Content
      ref={forwardedRef}
      className={`align-select-content${className ? ` ${className}` : ""}`}
      position={position}
      sideOffset={sideOffset}
      collisionPadding={8}
      {...rest}
    >
      <ScrollAreaPrimitives.Root type="auto">
        <SelectPrimitives.Viewport asChild>
          <ScrollAreaPrimitives.Viewport className="align-select-viewport">
            {children}
          </ScrollAreaPrimitives.Viewport>
        </SelectPrimitives.Viewport>
        <ScrollAreaPrimitives.Scrollbar className="align-select-scrollbar" orientation="vertical">
          <ScrollAreaPrimitives.Thumb className="align-select-thumb" />
        </ScrollAreaPrimitives.Scrollbar>
      </ScrollAreaPrimitives.Root>
    </SelectPrimitives.Content>
  </SelectPrimitives.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Item>
>(({ className, children, ...rest }, forwardedRef) => (
  <SelectPrimitives.Item
    ref={forwardedRef}
    className={`align-select-item${className ? ` ${className}` : ""}`}
    {...rest}
  >
    <SelectPrimitives.ItemText>{children}</SelectPrimitives.ItemText>
    <SelectPrimitives.ItemIndicator className="align-select-item-indicator">
      <Icon icon={CheckIcon} size={17} />
    </SelectPrimitives.ItemIndicator>
  </SelectPrimitives.Item>
));
SelectItem.displayName = "SelectItem";

export {
  SelectRoot as Root,
  SelectTrigger as Trigger,
  SelectValue as Value,
  SelectContent as Content,
  SelectItem as Item,
};
