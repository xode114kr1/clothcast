-- AddCheckConstraint
ALTER TABLE "Clothes"
ADD CONSTRAINT "Clothes_formality_check"
CHECK ("formality" BETWEEN 1 AND 5);
