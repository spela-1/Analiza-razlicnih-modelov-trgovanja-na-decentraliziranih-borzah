
%% Price impact
X = 50;   % X = 5000;
Y = 5 * 10^4;    %Y = 5 * 10^6;
k = X*Y;
p0 = Y/X;

% k = (x + dx)(y + dy)
dX = 1;

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
dX1 = 1;

dY1 = k/(X1 +dX) - Y1 % predznak od dY je -

razlika = dY - dY1;
zdrs = p0 - p1
