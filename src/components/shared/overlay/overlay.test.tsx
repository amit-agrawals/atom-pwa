import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import Overlay from "./Overlay";

const CustomOverlayWrapper = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen((prev) => !prev)}>
        Toggle overlay
      </button>
      <Overlay open={isOpen} />
    </>
  );
};

test("should be able to toggle overlay", () => {
  render(<CustomOverlayWrapper />);

  // there is nothing really happening with the overlay when we toggle the state
  // it's only rendered in the modals which already return null when open === false
  // expect(screen.getByTestId("overlay")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /toggle overlay/i }));

  expect(screen.getByTestId("overlay")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /toggle overlay/i }));

  // there is nothing really happening with the overlay when we toggle the state
  // it's only rendered in the modals which already return null when open === false
  // expect(screen.getByTestId("overlay")).not.toBeInTheDocument();
});

test("should fire a custom clickHandler", () => {
  const handleClick = jest.fn();
  render(<Overlay open onClick={handleClick} />);

  fireEvent.click(screen.getByTestId("overlay"));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

test("should render with a custom opacity", () => {
  const { container } = render(<Overlay open opacity={0.75} />);

  expect(container.querySelector(".overlay")).toHaveStyle({ opacity: 0.75 });
});
