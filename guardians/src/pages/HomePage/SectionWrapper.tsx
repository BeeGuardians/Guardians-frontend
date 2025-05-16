// components/SectionWrapper.tsx
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SectionWrapper = ({ children }: { children: React.ReactNode }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 80 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
        >
            {children}
        </motion.div>
    );
};

export default SectionWrapper;
