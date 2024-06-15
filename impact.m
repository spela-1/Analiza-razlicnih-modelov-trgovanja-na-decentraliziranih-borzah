function [vpliv,X1,Y1,p1] = impact(X,Y,dX)
k = X*Y;
p0 = Y/X;

% k = (x + dx)(y + dy)
dY = k/(X +dX) - Y % predznak od dY je -

%price impact
vpliv = (p0 + dY)/p0; 

% število žetonov
Y1 = Y + dY;
X1 = X + dX;
p1 = Y1/X1

% število žetonov ki jih dobi uporabnik s provizijo:
dY_p = dY * (1 - 0.003);
Y1_p = Y + dY* (1 - 0.003);

% slipage

% k = (x + dx)(y + dy)

%dY1 = k/(X1 +dX) - Y1 % predznak od dY je -

%razlika = dY - dY1;
%zdrs = p0 - p1
