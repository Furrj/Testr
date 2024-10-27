import { useRef } from "react";
import styles from "./Landing.module.scss";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
	const rootRef = useRef<HTMLDivElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	return (
		<main className={styles.root} ref={rootRef}>
			<div className={styles.scroll} ref={scrollRef}>
				<section className={styles.words}>
					<div>
						Help your students <span className={styles.accent}>master</span>{" "}
						math.
					</div>
				</section>

				<section className={styles.get_started}>
					<Link to={"/register"} className="link" id={styles.start}>
						Get Started With A Free Trial
					</Link>
				</section>
			</div>
		</main>
	);
};

export default Landing;
