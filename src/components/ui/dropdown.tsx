// AlignUI Dropdown v1.2 — adapted to the Zemo CSS token layer.
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";

const DropdownRoot = DropdownMenuPrimitive.Root;
const DropdownTrigger = DropdownMenuPrimitive.Trigger;

const DropdownContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 8, align = "start", ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={forwardedRef}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={8}
      className={`align-dropdown-content${className ? ` ${className}` : ""}`}
      {...rest}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownContent.displayName = "DropdownContent";

const DropdownCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, onSelect, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={forwardedRef}
    className={`align-dropdown-checkbox-item${className ? ` ${className}` : ""}`}
    onSelect={(event) => {
      event.preventDefault();
      onSelect?.(event);
    }}
    {...rest}
  >
    <span className="align-dropdown-checkbox" aria-hidden="true">
      <DropdownMenuPrimitive.ItemIndicator>
        <Icon icon={CheckIcon} size={13} strokeWidth={2} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    <span className="align-dropdown-checkbox-label">{children}</span>
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownCheckboxItem.displayName = "DropdownCheckboxItem";

export {
  DropdownRoot as Root,
  DropdownTrigger as Trigger,
  DropdownContent as Content,
  DropdownCheckboxItem as CheckboxItem,
};
