import { render, screen } from "@testing-library/react";
import CourseCard from "@/components/CourseCard/CourseCard";

describe("CourseCard", () => {
  const defaultProps = {
    id: "1",
    title: "Йога",
    imageSrc: "/test.jpg",
    duration: "25 дней",
    dailyTime: "20-50 мин/день",
    difficulty: "легкий",
  };

  it("renders course title", () => {
    render(<CourseCard {...defaultProps} />);
    expect(screen.getByText("Йога")).toBeInTheDocument();
  });

  it("renders duration", () => {
    render(<CourseCard {...defaultProps} />);
    expect(screen.getByText("25 дней")).toBeInTheDocument();
  });

  it("renders daily time", () => {
    render(<CourseCard {...defaultProps} />);
    expect(screen.getByText("20-50 мин/день")).toBeInTheDocument();
  });

  it("renders difficulty", () => {
    render(<CourseCard {...defaultProps} />);
    expect(screen.getByText("легкий")).toBeInTheDocument();
  });
});
