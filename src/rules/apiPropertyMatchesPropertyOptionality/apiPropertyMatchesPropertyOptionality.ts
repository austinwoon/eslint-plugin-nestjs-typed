// Import { getParserServices } from "@typescript-eslint/experimental-utils/dist/eslint-utils";
// import * as tsutils from "tsutils";
// import { getParserServices } from "@typescript-eslint/experimental-utils/dist/eslint-utils";
import {TSESTree} from "@typescript-eslint/types";
import {createRule} from "../../utils/createRule";
import {typedTokenHelpers} from "../../utils/typedTokenHelpers";

export const shouldUseRequiredDecorator = (
    node: TSESTree.ClassProperty
): boolean => {
    const hasOptionalDecorator = typedTokenHelpers.nodeHasDecoratorNamed(
        node,
        "ApiPropertyOptional"
    );

    const isOptionalPropertyValue =
        typedTokenHelpers.isOptionalPropertyValue(node);

    return hasOptionalDecorator && !isOptionalPropertyValue;
};

export const shouldUseOptionalDecorator = (
    node: TSESTree.ClassProperty
): boolean => {
    const hasRequiredDecorator = typedTokenHelpers.nodeHasDecoratorNamed(
        node,
        "ApiProperty"
    );

    const isOptionalPropertyValue =
        typedTokenHelpers.isOptionalPropertyValue(node);

    return hasRequiredDecorator && isOptionalPropertyValue;
};

const rule = createRule({
    name: "api-property-matches-property-optionality",
    meta: {
        docs: {
            description: "Public api methods should have documentation",
            category: "Best Practices",
            recommended: false,
            requiresTypeChecking: true,
        },
        messages: {
            shouldUseOptionalDecorator: `Property marked as optional should use @ApiPropertyOptional decorator`,
            shouldUseRequiredDecorator: `Property marked as required should use @ApiProperty decorator`,
        },
        schema: [],
        type: "suggestion",
    },
    defaultOptions: [],

    create(context) {
        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            ClassProperty(node: TSESTree.ClassProperty): void {
                if (shouldUseOptionalDecorator(node)) {
                    context.report({
                        node: node,
                        messageId: "shouldUseOptionalDecorator",
                    });
                }
                if (shouldUseRequiredDecorator(node)) {
                    context.report({
                        node: node,
                        messageId: "shouldUseRequiredDecorator",
                    });
                }
            },
        };
    },
});

export default rule;